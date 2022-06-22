import {
    CERTIFICATE_CONTROLLER_ID,
    CERTIFICATE_DID,
    CERTIFICATE_NAMESPACE, CERTIFICATE_NAMESPACE_V2,
    CERTIFICATE_PUBKEY_ID, CERTIFICATE_SIGNED_KEY_TYPE, 
    certificatePublicKeyBase58,
    certificatePublicKey
} from "./config.mjs";
import {vaccinationContext, vaccinationContextV2} from 'vaccination-context';
import * as credentialsv1  from'./utils/credentials.js';
import { axiosInstance } from "./service/index.js";
import * as jsigs  from 'jsonld-signatures';
import {contexts}  from 'security-context';
import * as crypto  from 'crypto-ld';
import pkg from 'jsonld';
import * as vc from "vc-js";


const {documentLoader} = pkg;
const customLoader = url => {
    const c = {
        "https://w3id.org/security/v1": contexts.get("https://w3id.org/security/v1"),
        'https://www.w3.org/2018/credentials#': credentialsv1,
        "https://www.w3.org/2018/credentials/v1": credentialsv1,
        [CERTIFICATE_NAMESPACE]: vaccinationContext,
        [CERTIFICATE_NAMESPACE_V2]: vaccinationContextV2,
    };
    let context = c[url];
    if (context === undefined) {
        context = contexts[url];
    }
    if (context !== undefined) {
        return {
            contextUrl: null,
            documentUrl: url,
            document: context
        };
    }
    if (url.startsWith("{")) {
        return JSON.parse(url);
    }
    return documentLoader()(url);
};

const certificateStatus = async (certificateData) =>{

    setTimeout(()=>{
        try {
            axiosInstance()
              .post("/divoc/api/v1/events/", [{"date":new Date().toISOString(), "type":"verify"}])
              .catch((e) => {
                console.log(e);
            });
        } catch (e) {
            console.log(e);
        }
    }, 10)

    const res =  verifyData(certificateData);

    return res
};

const verifyData = async (certificateData) =>{
    try {
        const signedJSON = certificateData;
        const { AssertionProofPurpose } = jsigs.purposes;
        let result;
        if(CERTIFICATE_SIGNED_KEY_TYPE === "RSA") {
            const publicKey = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_DID,
                type: 'RsaVerificationKey2018',
                controller: CERTIFICATE_PUBKEY_ID,
                publicKeyPem: certificatePublicKey
            };
            const controller = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_CONTROLLER_ID,
                publicKey: [publicKey],
                // this authorizes this key to be used for making assertions
                assertionMethod: [publicKey.id]
            };

            const key = new crypto.RSAKeyPair({...publicKey});
            const {RsaSignature2018} = jsigs.suites;
            result = await jsigs.verify(signedJSON, {
                suite: new RsaSignature2018({key}),
                purpose: new AssertionProofPurpose({controller}),
                documentLoader: customLoader,
                compactProof: false
            });
        } else if (CERTIFICATE_SIGNED_KEY_TYPE === "ED25519") {
            const publicKey = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_DID,
                type: 'Ed25519VerificationKey2018',
                controller: CERTIFICATE_PUBKEY_ID,
            };

            const controller = {
                '@context': jsigs.SECURITY_CONTEXT_URL,
                id: CERTIFICATE_CONTROLLER_ID,
                publicKey: [publicKey],
                // this authorizes this key to be used for making assertions
                assertionMethod: [publicKey.id]
            };

            const purpose = new AssertionProofPurpose({
                controller: controller
            });
            const {Ed25519Signature2018} = jsigs.suites;
            const key = new crypto.Ed25519KeyPair(
                {
                    publicKeyBase58: certificatePublicKeyBase58,
                    id: CERTIFICATE_DID
                }
            );
            result = await vc.verifyCredential({
                credential: signedJSON,
                suite: new Ed25519Signature2018({key}),
                purpose: purpose,
                documentLoader: customLoader,
                compactProof: false
            });
        }
        if (result.verified) {
            const revokedResponse = await checkIfRevokedCertificate(signedJSON);
            if (revokedResponse.status === 404) {
                console.log('Signature verified.');
     
                console.log(signedJSON);
                return { 'message': 'Signature verified', 'data': signedJSON}
            }else if(revokedResponse.status === 200){
                console.log('Certificate revoked.');
        
                    console.log(signedJSON.credentialSubject);
                    return {'message': 'Certificate revoked'}
            }
        }
    } catch (e) {
        return {'message': 'Invalid data', 'error': e}
    } finally {
    }
}

const checkIfRevokedCertificate = async (data) =>{
    return axiosInstance()
        .post("/divoc/api/v1/certificate/revoked", data)
        .then((res) => {
            console.log(res);
            // dispatch(addEventAction({type: EVENT_TYPES.REVOKED_CERTIFICATE, extra: certificateData}));
            return res
        }).catch((e) => {
            console.log(e.response);
            return e.response
        });
}

export { certificateStatus };

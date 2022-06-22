const registerMemberLimit = 4;
const certificatePublicKey = process.env.APP_CERTIFICATE_PUBLIC_KEY || "-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0i7R4XsyG3m6KD36qKEVxE+odCh68W2O4vLqh6SnsgItzvLYvJKPai+jEkf22FlPn0QnGo+Znyi6dw1lhvg9FGXqodv33yrqKhGLkQPeURaMnJidxktK/3QLXuv9HiKq9fSDLJyPBJEFCCCiZNTGgWM0dqq43/XRi+7IX3gWU68U6v/7EyOW3U4ZgYUVlfwbUh6eKRan68/TObQua39oeUfDMhJa0NHnMXb1lq/vQIjEgGkOK5LLyz+X8ETUEhn8Qdx2SIORmftCPW4XO0UZmMHuGw9t+UUgniy5BL8kmvtjpVRWFUliJFGBTvBZCO6gcoX5eXi8LytCg+mJ6EDO+QIDAQAB -----END PUBLIC KEY-----"

const CERTIFICATE_CONTROLLER_ID = process.env.APP_CERTIFICATE_CONTROLLER_ID || 'https://divoc.dev/';
const CERTIFICATE_NAMESPACE = process.env.APP_CERTIFICATE_NAMESPACE || "https://divoc.dev/credentials/vaccination/v1";
const CERTIFICATE_NAMESPACE_V2 = process.env.APP_CERTIFICATE_NAMESPACE_V2 || "https://divoc.dev/credentials/vaccination/v2";
const CERTIFICATE_PUBKEY_ID = process.env.APP_CERTIFICATE_PUBKEY_ID || 'https://example.com/i/india';
const CERTIFICATE_DID = process.env.APP_CERTIFICATE_DID || 'did:india';
const CERTIFICATE_SCAN_TIMEOUT = process.env.APP_CERTIFICATE_SCAN_TIMEOUT || '45000';
const CERTIFICATE_SIGNED_KEY_TYPE = process.env.APP_CERTIFICATE_SIGNED_KEY_TYPE || 'RSA';
const certificatePublicKeyBase58 = process.env.APP_CERTIFICATE_PUBLIC_KEY_BASE58 || "DaipNW4xaH2bh1XGNNdqjnSYyru3hLnUgTBSfSvmZ2hi";

export {
    certificatePublicKey,
    registerMemberLimit,
    CERTIFICATE_CONTROLLER_ID,
    CERTIFICATE_DID,
    CERTIFICATE_NAMESPACE,
    CERTIFICATE_NAMESPACE_V2,
    CERTIFICATE_PUBKEY_ID,
    CERTIFICATE_SCAN_TIMEOUT,
    CERTIFICATE_SIGNED_KEY_TYPE,
    certificatePublicKeyBase58
};

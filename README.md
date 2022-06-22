# Co-WIN node.js certificate verifier

A simple API to verify Co-WIN vaccination certificate which has a digitally signed secure QR code.

## Express API Key Authentication Example

This example shows a simple way to secure an API, you a single API Key, which must be given in all requests. This API Key can be stored in the server's environment variables and compared against a second token passed in the request http header.

```
app.use(function (req, res, next) {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
  res.append('Access-Control-Allow-Headers', 'Content-Type, API-Key');
  next();
})

```

### PROTECT ALL ROUTES THAT FOLLOW

Here we are securing the endpoint, only a request with a matching API-Key set in the environment variable will be accepted.

```
app.use((req, res, next) => {
  const apiKey = req.get('API-Key')
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({error: 'unauthorised'})
  } else {
    next()
  }
})
```

In this example, the AJAX code retrieves the token from local storage. In the same way, if you wanted an easy way to add Admin access to your API, you could manually add this token to the local storage on your browser, then only you would be able to access the Admin features of the API.

You can use something like: http://randomkeygen.com/ to generate a random key.

### Co-WIN certifcate verification 

#### Making a request with Python

You can verify a certicate using this single endpoint by sending decoded data from QR code of the certficate. You can use a library like [PyDIVOC](https://pypi.org/project/PyDIVOC/) to decode CoWIN QR code.


```
from PyDIVOC.divoc_qr import decode_divoc_covid19_qr
import requests


w3c_vc = decode_divoc_covid19_qr("q.png")
payload = {"cert": w3c_vc}
url = 'http://localhost:3000/cowin/cert/verify/'
headers = {
    'Accept': 'application/json',
    'API-Key': 'E15D57CC81D8ECAADDFBA19CC82C1'
    }

if __name__ == '__main__':

    response = requests.post(url, headers=headers, data=payload)
    print(response.text)
```

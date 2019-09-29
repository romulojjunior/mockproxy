## MockProxy
This project is a simple mock server with fallback mode.

## Features
- Create api mock with folder and json files.
- Proxy to other api mock using fallback mode.

## Mock files
Create a file into data/api/v1/test folder
- res_get.json
- res_post.json
- res_put.json
- ...

```js
{
  "statusCode": 200,
  "headers": {
    
  },
  "body": {

  }
}
```

## Run server
```js
// Create .env
export MOCK_DEBUG=false
export MOCK_SERVER_PORT=3000
export MOCK_HOST="www.my-default-mock.xyz.com"
export MOCK_PORT=80

// Exc
source .env

// Dependencies
npm install

// Build app
npm run build

// Start
npm start
```

## Tests

```js
npm run jest
```
or 
```js
curl -X GET localhost:3000/api/v1/test
```

## TODO
- Api dump mode (cache to api request)
- More unit tests
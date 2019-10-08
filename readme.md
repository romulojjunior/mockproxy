## MockProxy
This project is a simple mock server with fallback mode.

## Features
- Create api mock with folder and json files.
- Create mock files using fallback mode.
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
export MOCK_CACHE=false
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

## Create cache from fallback
This flag allow to create mock files automatic. Every new request to another server is cache and saved in new json file.

```js
// enable cache
export MOCK_CACHE=true
// enable fallback mode
export MOCK_HOST="www.my-default-mock.xyz.com"
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
- More unit tests
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
export MOCK_DEBUG=true
export MOCK_CACHE=true
export MOCK_SERVER_PORT=3000
export MOCK_HEADERS='{"connection": "keep-alive", "cache-control": "max-age=0", "user-agent": "MacOSx", "accept": "application/json"}'

export MOCK_ENABLE_HTTPS=true
export MOCK_PROXY_HOST="de1.api.radio-browser.info"
export MOCK_PROXY_PORT=443


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
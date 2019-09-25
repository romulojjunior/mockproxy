const envs = require('dotenv').config()
const http = require('http');
const process = require('process');
const fs = require('fs');

// LOCAL ENVS

const isDebug = process.env.MOCK_DEBUG
const enableProxy = process.env.MOCK_ENABLE_PROXY || true
const serverPort = process.env.MOCK_SERVER_PORT || 3000
const mockHOST = process.env.MOCK_HOST || undefined
const mockPort = process.env.MOCK_PORT || 80

const logd = (...args) => {
  if (isDebug) console.log(...args)
}

const log = (...args) => {
  console.log(...args)
}

const withFilePath = (url, method) => {
  const name = 'res_' + method.toLowerCase()
  return `./data${url}/${name}.json`
}

const openJSON = (filePath) => {
  logd(filePath)
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const findMockFile = (url, method) => {
  const filePath = withFilePath(url, method)
  const fallbackPath = withFilePath(url.split("?")[0], method)

  if (fs.existsSync(filePath)) {
    return openJSON(filePath)     
  } else if(fs.existsSync(fallbackPath)) {
    return openJSON(fallbackPath) 
  } else {
    return false
  }
}

const requestExternalMock = (client_req, client_res) => {
  if (!enableProxy || !mockHOST) {
    client_res.writeHead(500, {})
    client_res.end("Mock fallback is not enabled.")
    return
  }

  const options = {
    hostname: mockHOST,
    port: mockPort,
    path: client_req.url,
    method: client_req.method
  };

  try {  
    const proxy = http.request(options, (res) => {
      logd('response: ' + res.body)
      client_res.writeHead(res.statusCode, res.headers)
      res.pipe(client_res, { end: true });
    });
    client_req.pipe(proxy, { end: true });
  } catch(e) {
    logd(e)
    client_res.writeHead(500, {})
    client_res.end("Mock URL not found.")
  }
}

const onRequest = (client_req, client_res) => {
  let resJson = findMockFile(client_req.url, client_req.method);
  if (resJson) {
    log(resJson)
    client_res.writeHead(resJson.statusCode, resJson.headers)
    client_res.end(JSON.stringify(resJson.body))
  } else {
    requestExternalMock(client_req, client_res)
  }
}

log('----------------------------')
log('serverPort', serverPort)
log('mockHOST', mockHOST)
log('mockPort', mockPort)
log('enableProxy', enableProxy)
log('----------------------------')

// const options = {
//   key: fs.readFileSync('keys/default.key'),
//   cert: fs.readFileSync('keys/default.crt')
// };

http.createServer(onRequest).listen(serverPort);

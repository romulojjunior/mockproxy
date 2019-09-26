require('dotenv').config()
const http = require('http');
const process = require('process');
const fs = require('fs');
const { withFilePath, openJSON } = require('./utils/fileUtils');
const { log, logd } = require('./utils/logUtils')

const serverPort = process.env.MOCK_SERVER_PORT || 3000
const mockHOST = process.env.MOCK_HOST || undefined
const mockPort = process.env.MOCK_PORT || 80

log('----------------------------')
log('serverPort', serverPort)
log('mockHOST', mockHOST)
log('mockPort', mockPort)
log('----------------------------')

const findMockFile = (url, method) => {
  const filePath = withFilePath(url, method)
  const fallbackPath = withFilePath(url.split('?')[0], method)

  if (fs.existsSync(filePath)) {
    return openJSON(filePath)     
  } else if(fs.existsSync(fallbackPath)) {
    return openJSON(fallbackPath) 
  } else {
    return false
  }
}

const requestExternalMock = (client_req, client_res) => {
  if (!mockHOST) {
    client_res.writeHead(500, {})
    client_res.end('Mock fallback is not enabled.')
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
    client_res.end('Mock URL not found.')
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

http.createServer(onRequest).listen(serverPort);

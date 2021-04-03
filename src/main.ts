import App from './app';
import ExternalMockClient from './clients/external-mock-client';
import http from 'http';
import https from 'https';
import MockFile from './models/mock-file';
import { log } from './utils/log-utils';

function main() {
  // Local server
  const serverPort = Number(process.env.MOCK_SERVER_PORT) || 3000;
  const mockCache = JSON.parse(process.env.MOCK_CACHE || 'false');
  const mockHeaders = JSON.parse(process.env.MOCK_HEADERS || '{}')

  // Remote Proxy
  const mockEnableHttps = JSON.parse(process.env.MOCK_ENABLE_HTTPS || 'false');
  const mockProxyHost = process.env.MOCK_PROXY_HOST || undefined;
  const mockProxyPort = Number(process.env.MOCK_PROXY_PORT) || 80;

  let app: App = new App(serverPort, mockProxyHost, mockProxyPort);
  let externalMockClient: ExternalMockClient;

  if (mockProxyHost) {
    let client = mockEnableHttps ? https : http
    externalMockClient = new ExternalMockClient(client, mockProxyHost, mockProxyPort)
  }

  app.onMockFallback = (req, res) => {
    if (mockProxyHost) {
      if (mockCache) {
        externalMockClient.onFinished = (resFallback, result) => {
          const mockFile = new MockFile()
          mockFile.withHeaders(resFallback.headers);
          mockFile.withStatusCode(resFallback.statusCode);
          mockFile.withHttpVerb(req.method);
          mockFile.withPath(req.url);
          mockFile.withBody(JSON.parse(result));
          MockFile.save(req.url, mockFile);
        }
      }
      externalMockClient.request(req, res, mockHeaders);
    } else {
      res.writeHead(404, {});
      res.end('Mock fallback is not enabled.');
    }
  };

  app.createServer(http);

  log('------------ENV----------------');
  log('serverPort', serverPort);
  log('mockCache', mockCache);
  log('mockEnableHttps', mockEnableHttps);
  log('mockProxyHost', mockProxyHost);
  log('mockProxyPort', mockProxyPort);
  log('----------------------------');

  console.log(`Visit: http://localhost:${serverPort}`)
}

main()
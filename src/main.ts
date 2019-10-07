import App from './app';
import ExternalMockClient from './clients/external-mock-client';
import http from 'http';
import MockFiles from './utils/file-utils';
import MockFile from './models/mock-file';

function main() {
  const serverPort = Number(process.env.MOCK_SERVER_PORT) || 3000;
  const mockHost = process.env.MOCK_HOST || undefined;
  const mockPort = Number(process.env.MOCK_PORT) || 80;

  let app: App = new App(serverPort, mockHost, mockPort);
  let externalMockClient: ExternalMockClient;

  if (mockHost) {
    externalMockClient = new ExternalMockClient(http, mockHost, mockPort)
  }

  app.onMockFallback = (req, res) => {
    if (mockHost) {
      externalMockClient.onFinished = (resFallback, result) => {
        const mockFile = new MockFile()
        mockFile.withHeaders(resFallback.headers);
        mockFile.withStatusCode(resFallback.statusCode);
        mockFile.withHttpVerb(req.method);
        mockFile.withPath(req.url);
        mockFile.withBody(JSON.parse(result));
        MockFile.save(req.url, mockFile);
      }
      externalMockClient.request(req, res);
    } else {
      res.writeHead(500, {});
      res.end('Mock fallback is not enabled.');
    }
  };

  app.createServer(http);
}

main()
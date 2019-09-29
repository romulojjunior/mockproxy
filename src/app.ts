import process from 'process';
import http from 'http';

import { log, logd } from './utils/log-utils';

import MockFile from './models/mock-file';

interface Http {
  createServer(onRequest: (req: any, res: any) => any): any;
  listen(port: number): any;
}

class App {
  serverPort: number
  mockHost?: string
  mockPort: number
  onMockFallback: (req: any, res: any) => {};

  constructor(serverPort = 3000, mockHost?: string, mockPort = 80) {
    this.serverPort = serverPort;
    this.mockHost = mockHost;
    this.mockPort = mockPort;

    this.onMockFallback = (req, res) => {
      throw 'onMockFallback is not implemented.';
    };
  }

  private buildRequestCallback() {
    const onRequest = (req: any, res: any) => {
      log(req.url);
      let mockFile = MockFile.loadFromDisk(req.url, req.method);

      if (mockFile) {
        res.writeHead(mockFile.statusCode, mockFile.headers);
        res.end(JSON.stringify(mockFile.body));
      } else {
        this.onMockFallback(req, res);
      }
    };

    return onRequest;
  }

  createServer(http: Http | any) {
    log('----------------------------');
    log('serverPort', this.serverPort);
    log('mockHost', this.mockHost);
    log('mockPort', this.mockPort);
    log('----------------------------');

    let onRequest = this.buildRequestCallback();
    http.createServer(onRequest).listen(this.serverPort);
  }
}

function main() {
  const serverPort = Number(process.env.MOCK_SERVER_PORT) || 3000;
  const mockHost = process.env.MOCK_HOST || undefined;
  const mockPort = Number(process.env.MOCK_PORT) || 80;

  let app: App = new App(serverPort, mockHost, mockPort);
  app.onMockFallback = () => {
    return {
      "fallback": "ok"
    }
  };

  app.createServer(http);
}

main()
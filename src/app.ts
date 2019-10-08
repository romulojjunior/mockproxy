import process from 'process';
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
  onMockFallback: (req: any, res: any) => void;

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
      let mockFile = MockFile.load(req.url, req.method);
      if (mockFile) {
        res.writeHead(mockFile.statusCode, mockFile.headers);
        log(mockFile.body);
        res.end(JSON.stringify(mockFile.body));
      } else {
        this.onMockFallback(req, res);
      }
    };

    return onRequest;
  }

  createServer(http: Http | any) {
    let onRequest = this.buildRequestCallback();
    http.createServer(onRequest).listen(this.serverPort);
  }
}

export default App;
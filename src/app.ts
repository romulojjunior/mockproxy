import process from 'process';
import MockFile from './models/mock-file';
import http from 'http';

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
            let mockFile = new MockFile()
                .withPath(req.url)
                .withHttpVerb(req.method);

            let resJson = mockFile.asJson(); //findMockFile(req.url, req.method);
            if (resJson) {
            //   log(resJson);
              res.writeHead(resJson.statusCode, resJson.headers);
              res.end(JSON.stringify(resJson.body));
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

    console.log(app.onMockFallback(null, null));
}

main()
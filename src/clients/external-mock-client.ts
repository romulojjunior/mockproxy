import { log, logd } from '../utils/log-utils';

class ExternalMockClient {
  hostname: string
  port: number
  httpClient: any
  onFinished: (res: any, result: string) => void;

  constructor(httpClient: any, hostname: string, port: number) {
    this.httpClient = httpClient;
    this.hostname = hostname;
    this.port = port;

    this.onFinished = (res: any, result: string) => {}
  }

  request(appReq: any, appRes: any) {
    const options = {
      hostname: this.hostname,
      port: this.port,
      path: appReq.url,
      method: appReq.method,
      headers: JSON.stringify(appReq.headers)
    };
  
    try {  
      const proxy = this.httpClient.request(options, (res: any) => {
        let resBody: string = '';
        res.on('data', (chunk: any) => resBody += chunk);
        res.on('end', (chunk: any) => this.onFinished(res, resBody));

        appRes.writeHead(res.statusCode, res.headers);
        res.pipe(appRes, { end: true });
      });
      appReq.pipe(proxy, { end: true });
    } catch(e) {
      logd(e);
      appRes.writeHead(500, {});
      appRes.end('Mock URL not found.');
    }
  }
}

export default ExternalMockClient;
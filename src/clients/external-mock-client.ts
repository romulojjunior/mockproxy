import { log, logd } from '../utils/log-utils';

class ExternalMockClient {
  hostname: string
  port: number
  httpClient: any

  constructor(httpClient: any, hostname: string, port: number) {
    this.httpClient = httpClient;
    this.hostname = hostname;
    this.port = port;
  }

  request(appReq: any, appRes: any) {
    const options = {
      hostname: this.hostname,
      port: this.port,
      path: appReq.url,
      method: appReq.method
    };
  
    try {  
      const proxy = this.httpClient.request(options, (res: any) => {
        let resRow: string = '';
        res.on('data', (chunk: any) => resRow += chunk);
        res.on('end', (chunk: any) => log(resRow));

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
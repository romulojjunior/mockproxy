import FileUtils from '../utils/file-utils';

class MockFile {
  path?: string
  httpVerb?: string
  statusCode?: number
  headers?: object
  body?: object

  withHttpVerb(httpVerb: string) : MockFile{
    this.httpVerb = httpVerb;
    return this;
  }

  withPath(path: string) : MockFile {
    this.path = path;
    return this;
  }

  withStatusCode(statusCode: number) : MockFile{
    this.statusCode = statusCode;
    return this;
  }

  withHeaders(headers: Object) : MockFile{
    this.headers = headers;
    return this;
  }

  wittBody(body: Object) : MockFile{
    this.body = body;
    return this;
  }

  asJson() {
    return {
      "statusCode": this.statusCode,
      "headers": this.headers,
      "body": this.body
    }
  }

  static loadFromDisk(path: string, httpVerb: string) : MockFile | null {
    interface JsonFile {
      statusCode: number
      headers: object
      body: object
    };

    var jsonFile: JsonFile | null = null;
    const filePath = FileUtils.withFilePath(path, httpVerb);
    const fallbackPath = FileUtils.withFilePath(path.split('?')[0], httpVerb);

    if (FileUtils.existsSync(filePath)) {
      jsonFile = FileUtils.openJSON(filePath);     
    } else if(FileUtils.existsSync(fallbackPath)) {
      jsonFile = FileUtils.openJSON(fallbackPath); 
    } 

    if (jsonFile) {
      return new MockFile()
        .withPath(path)
        .withHttpVerb(httpVerb)
        .withStatusCode(jsonFile.statusCode)
        .withHeaders(jsonFile.headers)
        .wittBody(jsonFile.body)
    } else {
      return null;
    }
  }
}

export default MockFile;
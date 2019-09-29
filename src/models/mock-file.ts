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

  asJson() {
    return {
      "statusCode": 200,
      "headers": {
      },
      "body": {
        "test": true
      }
    }
  }
}

export default MockFile;
import fs from 'fs';

class FileUtils {
  static withFilePath(path: string, httpVerb: string) : string {
    const name = 'res_' + httpVerb.toLowerCase();
    return `./data${path}/${name}.json`;
  }

  static openJSON(filePath: string, storage = fs) : any {
    return JSON.parse(storage.readFileSync(filePath, 'utf8'));
  }

  static existsSync(filePath: string, storage = fs) : boolean {
    return fs.existsSync(filePath);
  }
  
}

export default FileUtils;
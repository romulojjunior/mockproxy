import fs from 'fs';
import shell from 'shelljs';

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

  static createDir(path: string) {
    if (!this.existsSync(path)) {
      shell.mkdir('-p', `./data/${path}`);
    }
  }

  static saveJSON(filePath: string, obj: Object, storage = fs) {
    let data = JSON.stringify(obj);
    return storage.writeFileSync(filePath, data);
  }
  
}

export default FileUtils;
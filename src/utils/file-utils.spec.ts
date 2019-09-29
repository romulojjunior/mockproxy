import FileUtils from './file-utils'

jest.mock('fs');

describe('fileUtils tests.', () => {

    test('Test withFilePath', () => {
        const url = 'api/v1/test';
        const method = 'GET';
        const fileName= 'res_get';
        const validPath = `./data${url}/${fileName}.json`;
        expect(FileUtils.withFilePath(url, method)).toEqual(validPath);
    });

    test('Test openJSON', () => {
        const json = FileUtils.openJSON('myFile.json');
        expect(json.test).toBeTruthy();
    });

});
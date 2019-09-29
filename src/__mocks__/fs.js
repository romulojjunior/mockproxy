const fs = jest.genMockFromModule('fs');

fs.mockFile = '{ "test": true }';

fs.readFileSync = () => {
    return fs.mockFile;
};
module.exports = fs;
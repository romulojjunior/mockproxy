const fs = require('fs');

const withFilePath = (url, method) => {
  const name = 'res_' + method.toLowerCase();
  return `./data${url}/${name}.json`;
};

const openJSON = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

module.exports = {
  withFilePath,
  openJSON
};
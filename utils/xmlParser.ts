const fs = require('fs');

export const XmlParser = {
  updateXml: (body, find, replace) => body.replace(new RegExp(find, 'g'), replace),
  uniqueString: () => (Math.random() * 1e32).toString(36),
  readXml: (xmlpath) => fs.readFileSync(xmlpath, 'utf-8'),
};

const Document = require("../models/Document");

const documentRepository = {
  async create(documentData) {
    const document = await Document.create(documentData);
    return document;
  },
};
module.exports = documentRepository;

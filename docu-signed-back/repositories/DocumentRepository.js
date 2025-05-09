const Document = require("../models/Document");

const documentRepository = {
  async create(documentData) {
    const document = await Document.create(documentData);
    return document;
  },
  async findById(id) {
    return await Document.findByPk(id);
  },
  async save(document) {
    return await document.save(); // poziva Sequelize .save() na instanci
  },
};

module.exports = documentRepository;

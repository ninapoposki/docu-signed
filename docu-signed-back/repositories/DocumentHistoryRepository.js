const DocumentHistory = require("../models/DocumentHistory");
const { Op } = require("sequelize");

const documentHistoryRepository = {
  async create(historyData) {
    const historyRecord = await DocumentHistory.create(historyData);
    return historyData;
  },

  async getHistoryByDocumentId(documentId) {
    const history = await DocumentHistory.findAll({
      where: { documentId },
      order: [["createdAt", "ASC"]],
    });
    return history; //○ Istorija promena za svaki dokument (ko je potpisao, kada).
  },
  async updateSignedStatus(documentId) {
    return await DocumentHistory.update(
      {
        isSigned: true,
        additionalInfo: {
          finalizedAt: new Date().toISOString(),
        },
      },
      {
        where: {
          documentId,
          // userEmail,
          isSigned: false,
        },
      }
    );
  },
  async findAllUnsignedDocsWithDeadline() {
    return await DocumentHistory.findAll({
      where: {
        isSigned: false,
        additionalInfo: {
          [Op.not]: null,
        },
      },
    });
  },
};
module.exports = documentHistoryRepository;

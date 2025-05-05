const documentHistoryService = require("../services/DocumentHistoryService");

const documentHistoryController = {
  async createHistory(req, res) {
    try {
      const newHistoryRecord = await documentHistoryService.logHistory(
        req.body
      );
      res.status(201).json(newHistoryRecord);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getHistoryForDocument(req, res) {
    try {
      const { documentId } = req.params;
      const historyRecords = await documentHistoryService.getHistory(
        documentId
      );
      res.status(200).json(historyRecords);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async sendFinalDocument(req, res) {
    try {
      const { email, fileName, originalName } = req.body;
      const result = await documentHistoryService.sendFinalDocument({
        email,
        fileName,
        originalName,
      });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error sending final document:", error);
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = documentHistoryController;

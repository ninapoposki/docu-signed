const documentService = require("../services/DocumentService");

const documentController = {
  async uploadDocument(req, res) {
    try {
      console.log("Decoded user:", req.user);

      const userId = req.user?.id || req.body.userId; // second one for sending req in postman – for now, without authorization
      // console.log("received file:", req.file);
      const newDocument = await documentService.uploadDocument(
        req.file,
        userId
      );

      res.status(201).json(newDocument);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
module.exports = documentController;

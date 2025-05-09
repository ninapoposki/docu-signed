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

  async sendForSignature(req, res) {
    try {
      const { documentId, recipientEmail, message, deadline, signatureFields } =
        req.body;

      if (!recipientEmail) {
        return res
          .status(400)
          .json({ message: "Recipient email is required." });
      }

      const result = await documentService.sendForSignature({
        documentId,
        recipientEmail,
        message,
        deadline,
        signatureFields,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error sending document for signature:", error);

      return res
        .status(400)
        .json({ message: "Failed to send document for signature" });
    }
  },
  async getDocumentById(req, res) {
    try {
      const document = await documentService.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document." });
    }
  },

  async finalizeSignature(req, res) {
    try {
      const { documentId, signatureFields } = req.body;

      if (!documentId || !signatureFields) {
        return res.status(400).json({ message: "Missing required data." });
      }

      const result = await documentService.finalizeSignature({
        documentId,
        signatureFields,
        // userEmail,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error finalizing signature:", error);
      res.status(500).json({ message: "Failed to finalize signature." });
    }
  },
};
module.exports = documentController;

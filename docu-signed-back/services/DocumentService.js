const documentRepository = require("../repositories/DocumentRepository");

const documentService = {
  // async createDocument(documentData) {},
  async uploadDocument(file, userId) {
    if (!file) {
      throw new Error("No file uploaded");
    }

    const { originalname, mimetype, size, filename } = file;

    const supportedFormats = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.oasis.opendocument.text", // .odt
      "image/jpeg",
      "image/png",
    ];

    if (!supportedFormats.includes(mimetype)) {
      throw new Error("Unsupported file format");
    }

    if (size > 20 * 1024 * 1024) {
      throw new Error("File exceeds 20MB limit");
    }
    // console.log("saving to database:", {
    //   userId,
    //   originalName: originalname,
    //   savedName: filename,
    //   type: mimetype,
    //   size,
    // });

    try {
      const createdDocument = await documentRepository.create({
        userId,
        originalName: originalname,
        savedName: filename,
        type: mimetype,
        size,
        createdAt: new Date(),
      });
      return createdDocument;
    } catch (error) {
      console.error("error while saving to database:", error);
      throw error;
    }

    // return new DocumentDTO(createDocument);
  },
};
module.exports = documentService;

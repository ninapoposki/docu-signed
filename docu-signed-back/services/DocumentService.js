const documentRepository = require("../repositories/DocumentRepository");
const { convertImageToPdf } = require("../utils/ConvertDocxToPdf");
const nodemailer = require("nodemailer");
const userRepository = require("../repositories/UserRepository");

const {
  generateSignedDocument,
  generateSignatures,
} = require("../utils/GenerateSignedDocument");
const path = require("path");
const documentHistoryRepository = require("../repositories/DocumentHistoryRepository");
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
  async sendForSignature({
    documentId,
    recipientEmail,
    message,
    deadline,
    signatureFields,
  }) {
    // cosnt transporter=nodemailer.
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const document = await documentRepository.findById(documentId);
    if (!document) {
      throw new Error("Document not found");
    }
    //const signedFileName = `signed_${Date.now()}_${document.savedName}`;
    //za docx u pdf
    const originalExt = path.extname(document.savedName);
    const baseName = path.basename(document.savedName, originalExt);
    const signedExt = originalExt === ".docx" ? ".pdf" : originalExt;

    const signedFileName = `signed_${Date.now()}_${baseName}${signedExt}`;

    const outputPath = path.join(
      __dirname,
      "..",
      "uploads",
      "signed",
      signedFileName
    );

    await generateSignedDocument({
      filePath: path.join(__dirname, "..", "uploads", document.savedName),
      fileType: document.type,
      signatureFields: signatureFields,
      outputPath: outputPath,
    });
    document.savedName = signedFileName;
    if (signedExt === ".pdf") {
      document.type = "application/pdf";
    }
    await documentRepository.save(document); // updateuje

    // link do dokumenta
    // const documentLink = `http://localhost:5000/uploads/signed/${signedFileName}`;
    const baseUrl = "http://localhost:3000/";
    const documentLink = `${baseUrl}sign-document/${documentId}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Document Signature Request",
      text: `You have been requested to sign a document. Document link: ${documentLink}
      ${message ? "\n\nMessage: " + message : ""}${
        deadline ? `\n\nDeadline (in days): ${parseInt(deadline, 10)}` : ""
      }`,
      attachments: [
        {
          filename: path.basename(outputPath),
          path: outputPath,
          contentType: "application/pdf",
        },
      ],
    };
    await transporter.sendMail(mailOptions);

    await documentHistoryRepository.create({
      documentId,
      isSigned: false,
      userEmail: recipientEmail,
      additionalInfo: {
        deadline: deadline ? parseInt(deadline, 10) : null,
      },
    });
    return { message: "Document sent for signature successfully." };
  },
  async getDocumentById(id) {
    return await documentRepository.findById(id);
  },

  //ZA FINAL
  async finalizeSignature({ documentId, signatureFields }) {
    const document = await documentRepository.findById(documentId); //ili samo by history id?
    if (!document) {
      throw new Error("Document not found");
    }
    const originalExt = path.extname(document.savedName);
    const baseName = path.basename(document.savedName, originalExt);
    const signedFileName = `final_${Date.now()}_${baseName}.pdf`;
    let inputPath = path.join(
      __dirname,
      "..",
      "uploads",
      "signed",
      document.savedName
    );
    const outputPath = path.join(
      __dirname,
      "..",
      "uploads",
      "signed",
      signedFileName
    );
    if ([".jpg", ".jpeg", ".png"].includes(originalExt.toLowerCase())) {
      const convertedPdfPath = inputPath.replace(originalExt, ".converted.pdf");
      await convertImageToPdf(inputPath, convertedPdfPath);
      inputPath = convertedPdfPath;
    }
    await generateSignatures({
      filePath: inputPath,
      signatureFields,
      outputPath,
    });
    document.savedName = signedFileName;
    document.type = "application/pdf";
    await documentRepository.save(document);
    await documentHistoryRepository.updateSignedStatus(documentId);
    const owner = await userRepository.findById(document.userId);
    if (owner?.email) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: owner.email,
        subject: "Your document has been signed!",
        text: `Hello ${owner.firstName || ""},
  
  Your document "${document.originalName}" has just been successfully signed.
  
  You can find the signed document attached in this email.
  
  Best regards,
  DocuSigned Team
        `,
        attachments: [
          {
            filename: signedFileName,
            path: outputPath,
            contentType: "application/pdf",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    return {
      message: "Document finalized and saved successfully.",
      fileName: signedFileName,
    };
  },
};
module.exports = documentService;

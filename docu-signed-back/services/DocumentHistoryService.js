const documentHistoryRepository = require("../repositories/DocumentHistoryRepository");
const documentHistoryDTO = require("../dtos/DocumentHistoryDTO");
const documentRepository = require("../repositories/DocumentRepository");
const nodemailer = require("nodemailer");
const path = require("path");
const documentHistoryService = {
  async logHistory(historyData) {
    try {
      const historyRecord = await documentHistoryRepository.create({
        documentId: historyData.documentId,
        isSigned: historyData.isSigned,
        userEmail: historyData.userEmail,
        additionalInfo: historyData.additionalInfo,
        createdAt: new Date(),
      });
      return new documentHistoryDTO(historyRecord);
    } catch (error) {
      console.error("Error logging document history:", error);
      throw error;
    }
  },
  async sendFinalDocument({ email, fileName, originalName }) {
    if (!email || !fileName) {
      throw new Error("Missing recipient email or file name.");
    }
    const filePath = path.join(__dirname, "..", "uploads", "signed", fileName);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Signed Document",
      text: `Dear recipient,

      Please find attached the signed document: ${fileName || originalName}.
      
      If you have any questions or require further assistance, feel free to get in touch.
      
      Best regards,  
      DocuSigned Team`,
      attachments: [
        {
          filename: fileName || originalName,
          path: filePath,
          contentType: "application/pdf",
        },
      ],
    };
    await transporter.sendMail(mailOptions);
    return { message: "Final document sent successfully." };
  },

  async sendDeadlineReminders() {
    try {
      const docsWithDeadline =
        await documentHistoryRepository.findAllUnsignedDocsWithDeadline();
      const now = new Date();

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      for (const doc of docsWithDeadline) {
        const { userEmail, additionalInfo, createdAt, documentId } = doc;
        const deadlineDays = additionalInfo?.deadline;

        if (!userEmail || !deadlineDays) continue;

        const deadlineDate = new Date(createdAt);
        deadlineDate.setDate(deadlineDate.getDate() + parseInt(deadlineDays));

        if (deadlineDate.toDateString() === now.toDateString()) {
          const document = documentRepository.findById(documentId);
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Reminder: Document deadline is today!",
            text: `Dear user,
  
          This is a reminder that the document  must be signed today.
          
          Please use the following link to sign it:
          http://localhost:3000/sign-document/${documentId}
          
          Best regards,  
          DocuSigned Team`,
          };

          await transporter.sendMail(mailOptions);
        }
      }
      return { message: "Reminders sent where deadline is today." };
    } catch (error) {
      console.error("Error with deadline reminder :", error);
      throw error;
    }
  },
};
module.exports = documentHistoryService;

class DocumentHistoryDTO {
  constructor({
    id,
    documentId,
    isSigned,
    userEmail,
    createdAt,
    additionalInfo,
    deadline,
  }) {
    this.id = id;
    this.documentId = documentId;
    this.isSigned = isSigned;
    this.userEmail = userEmail;
    this.createdAt = createdAt;
    this.additionalInfo = additionalInfo;
    this.deadline = deadline;
  }
}

module.exports = DocumentHistoryDTO;

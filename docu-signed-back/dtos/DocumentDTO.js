class DocumentDTO {
  constructor({ id, userId, type, size, originalName, savedName, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.size = size;
    this.originalName = originalName;
    // this.savedName = savedName; //ne?
  }
}

module.exports = DocumentDTO;

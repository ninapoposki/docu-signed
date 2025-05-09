const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const DocumentHistory = sequelize.define(
  "DocumentHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isSigned: {
      type: DataTypes.BOOLEAN,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: true, //ne mora ga potpisati
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    additionalInfo: {
      type: DataTypes.JSONB,
      allowNull: true, //koristicemo za deadline
    },
  },
  {
    tableName: "document_history",
    timestamps: false,
  }
);
module.exports = DocumentHistory;

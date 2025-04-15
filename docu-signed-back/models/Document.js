const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Document = sequelize.define(
  "Document",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 20 * 1024 * 1024, // 20MB
      },
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    savedName: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "documents",
    timestamps: false,
  }
);

module.exports = Document;

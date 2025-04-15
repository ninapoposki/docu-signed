const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Document = require("./Document");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6],
      },
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    tableName: "users",
    timestamps: false,
  }
);
User.hasMany(Document, { foreignKey: "userId", onDelete: "CASCADE" });
Document.belongsTo(User, { foreignKey: "userId" });
module.exports = User;

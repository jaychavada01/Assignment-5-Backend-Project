const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coins: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
  },
  forgetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  forgetPasswordTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// hash password before saving in database
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;

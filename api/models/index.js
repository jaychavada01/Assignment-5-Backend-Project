const { sequelize } = require("../config/database");
const User = require("./user");

const syncDB = async (req, res) => {
    try {
        await sequelize.sync({alter: true})
        console.log("Database & Table Synced!")
    } catch (error) {
        console.error("Error while syncing database!")
    }
};


module.exports = {syncDB, User};
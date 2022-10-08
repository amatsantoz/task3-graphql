const { Sequelize, DataTypes } = require('sequelize');

// sql server
const sequelize = new Sequelize('NodeDB', 'amad', '123', {
	dialect: 'mssql',
	//host: "192.168.xx",
	dialectOptions: {
		// Observe the need for this nested `options` field for MSSQL
		options: {
			// Your tedious options here
			useUTC: false,
			dateFirst: 1,
		},
	},
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.newss = require('./news')(sequelize, Sequelize);
db.users = require('./user')(sequelize, Sequelize);
db.comments = require('./comment')(sequelize, Sequelize);

db.newss.hasMany(db.comments)
db.comments.belongsTo(db.newss)
module.exports = db;
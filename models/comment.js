module.exports = (sequelize, Sequelize) => {
	const Comment = sequelize.define("comment", {
		description: {
			type: Sequelize.STRING
		}
	});
	return Comment;
};
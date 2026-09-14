const sequelize = require('../config/database');
const Workspace = require('./Workspace');
const User = require('./User');
const Feedback = require('./Feedback');

// 🔐 Multi-Tenant Scoping & Cascade Relationships
Workspace.hasMany(User, { foreignKey: 'workspaceId', onDelete: 'CASCADE' });
User.belongsTo(Workspace, { foreignKey: 'workspaceId' });

Workspace.hasMany(Feedback, { foreignKey: 'workspaceId', onDelete: 'CASCADE' });
Feedback.belongsTo(Workspace, { foreignKey: 'workspaceId' });

module.exports = {
  sequelize,
  Workspace,
  User,
  Feedback
};

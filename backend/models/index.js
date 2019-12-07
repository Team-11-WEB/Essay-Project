'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Attach = require('./attach')(sequelize, Sequelize);
db.Class = require('./class')(sequelize, Sequelize);
db.Essay = require('./essay')(sequelize, Sequelize);
db.Qna = require('./qna')(sequelize, Sequelize);
db.Schedule = require('./schedule')(sequelize, Sequelize);

db.User.hasMany(db.Qna, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});
db.Qna.belongsTo(db.User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});

db.User.hasMany(db.Essay, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});
db.Essay.belongsTo(db.User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id'
  }
});

db.Schedule.belongsToMany(db.Attach, { through: 'schedule_attach' });
db.Attach.belongsToMany(db.Schedule, { through: 'schedule_attach' });

module.exports = db;

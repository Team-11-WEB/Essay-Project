const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const { hash } = require('../utils/encryptPW');

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

const User = require('./user')(sequelize, Sequelize);
const Schedule = require('./schedule')(sequelize, Sequelize);
const Qna = require('./qna')(sequelize, Sequelize);
const Essay = require('./essay')(sequelize, Sequelize);
const Classstory = require('./classstory')(sequelize, Sequelize);
const Attach = require('./attach')(sequelize, Sequelize);
const New = require('./new')(sequelize, Sequelize);

module.exports = {
  relationInit: () => {
    User.hasMany(Qna, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
    Qna.belongsTo(User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });

    User.hasMany(Essay, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
    Essay.belongsTo(User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id'
      }
    });
  },
  dataInit: () => {
    User.create({
      classId: 'admin',
      password: hash('admin'),
      email: 'bsww201@naver.com',
      name: 'admin'
    });

    Essay.create({
      bookName: '역사의 역사',
      bookAuthor: '유시민',
      essayAuthor: '보리밥',
      title: '역사의 역사를 읽고...',
      content:
        "역사가의 속마음을 전달하고, 놓치지 말아야 할 부분을 체크해 주거나, 이해하지 못해도 좋다고 위로하고 격려하는 안내자 역할까지 맡았다. 역사에 대한 애정과 역사 공부의 중요성을 몸소 보여주며, 자신의 역사 공부법을 공개하는 셈이다. 역사의 힘과 논리, 역사가의 생각과 감정, 역사 공부의 재미와 깨달음을 함께 나누는 가운데 저마다 '어떻게 살 것인가'라는 질문으로 나아가게 한다."
    }).then(essay => {
      User.create({
        classId: '수요일 중등반',
        email: 'boribap@naver.com',
        password: hash('rlaqhdnjs96'),
        name: '보리밥'
      }).then(user => {
        user.addEssay(essay);
      });
    });
  }
};

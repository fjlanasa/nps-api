var db = require('../models/index.js');

db.Park.destroy({where: {}}).then(() => {
  console.log('destroyed');
  db.sequelize.close();
});

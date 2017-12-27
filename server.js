require('./server/config/config.js');

let express = require('express');
let app = express();

let apiRoutes = require('./server/routes/apiRoutes.js');

app.use('/', apiRoutes);

let server = app.listen(process.env.PORT, () => {
  console.log(`listening on ${server.address().port}`);
});

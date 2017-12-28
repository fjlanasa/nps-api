const express = require('express');
const router = express.Router();
var models = require('../models/index.js');

router.get('/', (req, res) => {
  models.Park.findAll().then((parks) => {
    res.send(parks);
  })
  .catch((err) => {
    console.log(err);
  })
});

router.get('/park/:parkCode', (req, res) => {
  models.Park.findOne({ where: { parkCode: req.params.parkCode }).then((park) => {
    res.send(park);
  })
  .catch((err) => {
    console.log(err);
  })
});

module.exports = router;

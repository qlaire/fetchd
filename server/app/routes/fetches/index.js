'use strict';
var router = require('express').Router();
module.exports = router;

router.get('/my-fetch', function (req, res, next) {
  console.log('in this route------------');
  if (!req.session.fetch) {
    res.sendStatus(204);
  } else {
    res.status(200).json(req.session.fetch);
  }
});

router.put('/my-fetch', function (req, res, next) {
  req.session.fetch = req.body;
  res.sendStatus(200);
})

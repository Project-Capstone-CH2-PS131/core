const express = require('express');
const router = express.Router();

router.all('*', function (_, res) {
  res.status(404)
    .json({
      'error': true,
      'message': 'Not Found',
    })
    .end()
});

module.exports = router;

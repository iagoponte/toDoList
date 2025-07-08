const express = require('express');
const router = express.Router();

router.use('/api', require('./todo.routes'));

module.exports = router;
const express = require('express');
const { fetchList, getList, getCVE } = require('../controllers/cveController');
const router = express.Router();

router.route('/fetch').get(fetchList)
router.route('/list').get(getList)
router.route('/list/:id').get(getCVE)
 
module.exports = router;

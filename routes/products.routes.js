var express = require('express');
const { orderProduct, orderList, confirmSendmail,  } = require('../controller/products.controller');
const { authenticate } = require('../lib/authentication');
var router = express.Router();

/* Products & Payments */
router.post('/:uId', authenticate, orderProduct);

router.get('/:uId', authenticate, orderList);

router.get("/:uId/:pId", authenticate, confirmSendmail)

module.exports = router;

var express = require('express');
const { accessChat, fetchChats, accessConvo, getConvo, addMsg, getMsg, getVendorConvo, accessVendorConvo, searchVendors,findOrCreate } = require('../controller/chatController');
const { verifyAccessToken,verifyVendorAccessToken } = require("../helpers/jwt_helpers");
var router = express.Router();


// @start a chat
// @body user Id
// @return chat room
router.post('/', verifyAccessToken, accessChat)



router.get('/', verifyAccessToken, fetchChats)



// @start a chat with vendor
// @body vendor Id
// @cookies userToken
// @return new conversation
router.post('/conversation', verifyAccessToken, accessConvo)



// @start a chat with user
// @body user Id
// @cookies vendorToken
// @return new conversation
router.post('/vendorConversation', verifyVendorAccessToken, accessVendorConvo)


// @get a chat
// @body user Id
// @return all conversation
router.get('/getuserconvo/:userId', getConvo)


// @get a chat
// @body user Id
// @return all conversation
router.get('/getvendorconvo/:vendorId', getVendorConvo)



// @Add a msg
// @body conversationId, msg content
// @return  status
router.post('/msg',  addMsg)



// @get messages
// @param conversationId
// @return  messages
router.get('/getMsg/:conversationId', getMsg)



// @Search vendors
// @Search query,
// @return  matched vendors
router.get('/search',searchVendors)



// @Find or create convo
// @Body current user and vendor Id
// @return  messages or new convo

router.post('/findOrCreateConvo', findOrCreate)




module.exports = router;

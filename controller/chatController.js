const Chat = require("../models/chatModel");
const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const Conversation = require("../models/ConversatioModel");
const Message = require("../models/MsgModel");
const asyncHandler = require("express-async-handler");
const { NotExtended } = require("http-errors");

module.exports = {
  accessChat: asyncHandler(async (req, res) => {
    // console.log(req.payload)
    console.log("here.................");
    const { userId } = req.body;
    console.log(userId);

    if (!userId) {
      console.log("userId not found");

      return res.sendStatus(400);
    }
    console.log("here.................");

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.payload.aud } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    console.log("here.................");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name propic email",
    });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.payload.aud, userId],
      };

      try {
        const createdChat = await Chat.create(chatData);

        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).send(fullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  }),

  fetchChats: asyncHandler(async (req, res) => {
    try {
      console.log("inside fetch chat");
      console.log(req.payload.aud);
      const userId = req.payload.aud;
      Chat.find({ users: { $elemMatch: { $eq: userId } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email ",
          });

          res.status(200).send(results);
        });
    } catch (err) {
      console.log(err);
      res.status(400);
      throw new Error(error.message);
    }
  }),



  accessVendorConvo: asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const currentVendor = req.payload.aud;

    console.log({ currentVendor });

    const newConversation = new Conversation({
      members: [userId, currentVendor],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      console.log(err);
    }
  }),

  accessConvo: asyncHandler(async (req, res) => {
    const { vendorId } = req.body;

    const currentUser = req.payload.aud;

    console.log({ currentUser });

    const newConversation = new Conversation({
      members: [vendorId, currentUser],
    });

    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (error) {
      console.log(err);
    }
  }),


  getConvo: asyncHandler(async (req, res) => {
    console.log("Reached getuser  convo");

    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });

    console.log(conversation);


    res.status(200).json(conversation);
  }),




  getVendorConvo: asyncHandler(async (req, res) => {
    console.log("Reached get  vendor convo");

    const conversation = await Conversation.find({
      members: { $in: [req.params.vendorId] },
    });

    console.log(conversation, "vendor conversation ");
    res.status(200).json(conversation);
  }),



  addMsg: asyncHandler(async (req, res) => {
    console.log(req.body);
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();

    res.status(200).json(savedMessage);
  }),

  getMsg: asyncHandler(async (req, res) => {
    console.log("reached get MSG");
    console.log(req.params.conversationId);

    const message = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(message);
  }),



  searchVendors: asyncHandler(async (req, res) => {

    const keyword = req.query.search?

    {
      $or:[

        {name:{$regex:req.query.search, $options:'i'}},
        { email : { $regex: req.query.search, $options: 'i'}}

          ],
    }:{}


    const vendors = await Vendor.find(keyword)

    console.log(keyword);
    console.log(vendors);
    res.json(vendors);
  }),





  findOrCreate: asyncHandler(async (req, res) => {


    const { vendorId,userId } = req.body;

  

const conversation = await Conversation.find({

      $and: [
      {
          members:{$in:[vendorId]}
      },
     
      {

        members:{$in:[userId]}
      }

    ] ,

    });

      if(conversation.length>0){


        console.log({conversation});  
        

        res.status(200).json(conversation);
      }else{

        const newConversation = new Conversation({
          members: [vendorId, userId],

        });

        try {
          const savedConversation = await newConversation.save();
          res.status(200).json(savedConversation);
        } catch (error) {
          console.log(err);
        }

      }

  })

};

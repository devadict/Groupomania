const db = require('../models');
const express = require("express");
const jwt = require('jsonwebtoken'); 

require("dotenv").config();

exports.getAllComments = async (req, res, next) => {
  await db.Comment.findAll({
        attributes: ["UserId", "id", "content", "createdAt", "PostId"],
        order: [["createdAt", "DESC"]],
        include: [db.User, db.Post],
       
    })
        .then(comments => res.send(comments));
    
}

exports.postComment = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    // const token = req.headers('Authorization').value;
  const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  db.Comment.create({
    PostId: req.params.id,
    content: req.body.content,
    UserId: userId
  }).then(Comment => res.json({Comment}));
}

exports.deleteComment = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId;
    let adminId;
    await db.User.findOne({ where: { isAdmin: true } }).then(
        (newadmin) => {
        adminId = newadmin.dataValues.id
        console.log("adminId: ", adminId)
        res.status(201).json({ newadmin });
        }
      );
   
    const comment = await db.Comment.findOne({ where: { id: req.params.id } });
    
    try {    
       if (comment.UserId == userId || userId == adminId) {
         await comment.destroy();
         console.log("Succès");
        } 
    } catch (err) {
        console.log(err)
    }
}

    
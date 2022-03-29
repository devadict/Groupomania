const db = require("../models");
const fs = require("fs");
const jwt = require("jsonwebtoken");

require("dotenv").config();


exports.createPost = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  // const token = req.headers('Authorization').value;
  const decodedToken = await jwt.verify(token, process.env.TOKEN_KEY);
  const userId = decodedToken.userId;
  const post = await db.Post.create({
    content: req.body.content,
    title: req.body.title,
    UserId: userId,
    imageUrl: req.file ? `${req.protocol}://${req.get("host")}/vid-api/images/${req.file.filename}` : "",
  }).then((post) => res.status(201).json({ post }));
  console.log(post);
};

exports.getAllPosts = async (req, res, next) => {
  await db.Post.findAll({
    attributes: ["UserId", "id", "imageUrl", "title", "content", "createdAt"],
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.User,
        attributes: ["username", "id"],
      },
      {
        model: db.Comment,
        attributes: ["content", "UserId", "id"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            attributes: ["username"],
          },
        ],
      },
    ],
  }).then((posts) => res.send(posts));
};

exports.deletePost = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  // const token = req.headers('Authorization');
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

  const post = await db.Post.findOne({
    where: { id: req.params.id },
  });
  try {
    if (userId == post.UserId || userId == adminId) {
      const filename = post.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        post.destroy();
        console.log("succès");
      })
    } 
  } catch (err) {
    console.log(err);
  }
  
};

exports.getSinglePost = async (req, res, next) => {
   db.Post.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: db.User,
        attributes: ["username", "id"],
      },
      {
        model: db.Comment,
        attributes: ["content", "UserId", "id"],
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: db.User,
            attributes: ["username"],
          },
        ],
      },
    ],
  }).then((post) => res.send(post));
}; 

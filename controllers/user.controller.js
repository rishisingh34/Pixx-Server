const User = require('../models/user.model');
const Post = require('../models/post.model');
const uploadOnCloudinary=require("../utils/cloudinary.util");
const mongoose = require('mongoose');

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

const getUserPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    const posts = await Post.find({ user: req.user.id }).populate( 'user', 'username avatar');
    const formattedPosts = posts.map((post) => {
      const isBookmarked = user.bookmarks.some(
        (bookmark) => bookmark._id.toString() === post._id.toString()
      );
      return {
        id: post.id,
        title: post.title,
        thumbnail: post.thumbnail,
        username: post.user.username,
        avatar: post.user.avatar,
        isBookmarked, 
      };
    });

    return res.status(200).json({ posts: formattedPosts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



const getAllPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    const posts = await Post.find().populate( 'user', 'username avatar');
    const formattedPosts = posts.map((post) => {
      const isBookmarked = user.bookmarks.some(
        (bookmark) => bookmark._id.toString() === post._id.toString()
      );
      return {
        id: post.id,
        title: post.title,
        thumbnail: post.thumbnail,
        username: post.user.username,
        avatar: post.user.avatar,
        isBookmarked, 
      };
    });

    return res.status(200).json({ posts: formattedPosts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




const createPost = async (req, res) => {
  try {
    if(req.file.size>500*1024){
      return res.status(400).json({message:"File size should be less than 500kb."});
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cloudinaryResponse = await uploadOnCloudinary(dataURI);
    
    const post = new Post({
      thumbnail : cloudinaryResponse.secure_url,
      title : req.body.title,
      user : req.user.id
    });
    await post.save(); 
    return res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
const getLatestPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5).populate('user', 'username avatar');
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      thumbnail: post.thumbnail,
      username: post.user.username,
      avatar: post.user.avatar
    }));
    return res.status(200).json({ posts: formattedPosts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


const searchPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.aggregate([
      {
        $match: {
          title: { $regex: req.query.title, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $addFields: {
          isBookmarked: {
            $in: ['$_id', (await User.findById(userId).select('bookmarks')).bookmarks],
          },
        },
      },
      {
        $project: {
          id: '$_id',
          title: 1,
          thumbnail: 1,
          username: '$userDetails.username',
          avatar: '$userDetails.avatar',
          isBookmarked: 1,
        },
      },
    ]);

    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


const addBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    const user = await User.findById(req.user.id);
    if(!user.bookmarks.includes(postId)){
      user.bookmarks.push(postId);
      await user.save();
    }
    return res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.body;
    const user = await User.findById(req.user.id);
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== postId
    );
    await user.save();
    return res.status(200).json({ message: "Post removed from bookmarks" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      populate: {
        path: 'user',
        select: 'username avatar',
      },
    });
    if (!user || user.bookmarks.length === 0) {
      return res.status(200).json({ posts: [], message: 'No bookmarks found.' });
    }
    const formattedPosts = user.bookmarks.map((post) => ({
      id: post.id,
      title: post.title,
      thumbnail: post.thumbnail,
      username: post.user.username,
      avatar: post.user.avatar,
      isBookmarked: true, 
    }));
    return res.status(200).json({ posts: formattedPosts });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserPosts,
  getAllPosts,
  createPost,
  getLatestPosts,
  getCurrentUser,
  searchPosts,
  addBookmark,
  removeBookmark,
  getBookmarks,
}
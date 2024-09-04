const router = require('express').Router();
const { auth } = require('../middlewares/auth.middleware.js');
const { 
  getUserPosts,
  createPost , 
  getAllPosts, 
  getLatestPosts , 
  getCurrentUser,
  searchPosts,
  addBookmark,
  removeBookmark,
  getBookmarks
} = require('../controllers/user.controller');
const upload = require("../middlewares/multer.middleware");

router.get('/profile', auth ,  getUserPosts);
router.post('/create', auth,upload.single('thumbnail'),  createPost);
router.get('/posts/all',auth,  getAllPosts);
router.get('/posts/latest', getLatestPosts);
router.get('/info', auth , getCurrentUser); 
router.get('/posts/search', searchPosts); 
router.post('/bookmark/add', auth , addBookmark);
router.post('/bookmark/remove', auth , removeBookmark);
router.get('/bookmarks', auth , getBookmarks); 

module.exports = router ; 
const { Router } = require("express");
const router = Router();

const {
  renderAddBlogPage,
  createBlog,
  getBlogById,
  addCommentbyBlogId,
  updateBlogById,
  deleteBlogById,
  editBlogCommentById,
  deleteBlogCommentById,
} = require("../controllers/blog");

// show add blog page
router.get("/add-new", renderAddBlogPage);

// create blog (multer middleware already global use ho raha hai)
router.post("/", createBlog);

// get blog by id
router.get("/:id", (req, res) => {
  return getBlogById(req, res, req.params.id);
});

// update blog
router.post("/update/:id", (req, res) => {
  return updateBlogById(req, res, req.params.id);
});

// delete blog
router.post("/delete/:id", (req, res) => {
  return deleteBlogById(req, res, req.params.id);
});

// add comment
router.post("/comment/:blogId", (req, res) => {
  return addCommentbyBlogId(req, res, req.params.blogId);
});

// Edit comment
router.post("/comment/update/:commentId", (req, res) => {
  return editBlogCommentById(req, res, req.params.commentId);
});

// Delete comment
router.post("/comment/delete/:commentId", (req, res) => {
  return deleteBlogCommentById(req, res, req.params.commentId);
});

module.exports = router;

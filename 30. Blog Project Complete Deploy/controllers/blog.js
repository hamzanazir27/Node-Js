const Blog = require("../models/blog");
const Comment = require("../models/comment");

// Show add blog form
async function renderAddBlogPage(req, res) {
  return res.render("addBlog", {
    user: req.user,
  });
}

// Create new blog
async function createBlog(req, res) {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: req.file ? "/uploads/" + req.file.filename : null,
  });

  return res.redirect(`/blog/${blog._id}`);
}

// Get blog by ID
async function getBlogById(req, res, id) {
  const blog = await Blog.findById(id).populate("createdBy");
  const comments = await Comment.find({ blogId: id }).populate("createdBy");

  return res.render("blog", {
    blog,
    user: req.user,
    comments,
  });
}

// Update blog
async function updateBlogById(req, res, id) {
  const { title, body } = req.body;
  const blog = await Blog.findById(id);

  if (!blog || blog.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send("Not allowed");
  }

  blog.title = title;
  blog.body = body;
  await blog.save();

  return res.redirect(`/blog/${blog._id}`);
}

// Delete blog
async function deleteBlogById(req, res, id) {
  const blog = await Blog.findById(id);

  if (!blog || blog.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).send("Not allowed");
  }

  await Blog.findByIdAndDelete(id);
  await Comment.deleteMany({ blogId: id }); // delete related comments

  return res.redirect("/");
}

// Add comment
async function addCommentbyBlogId(req, res, blogId) {
  await Comment.create({
    content: req.body.content,
    blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${blogId}`);
}

// Delete comment
async function deleteBlogCommentById(req, res, commentId) {
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    createdBy: req.user._id,
  });

  if (!comment) {
    return res.status(403).send("Not authorized to delete this comment");
  }

  return res.redirect(`/blog/${comment.blogId}`);
}

// Edit comment
async function editBlogCommentById(req, res, commentId) {
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, createdBy: req.user._id },
    { content },
    { new: true }
  );

  if (!comment) {
    return res.status(403).send("Not authorized to edit this comment");
  }

  return res.redirect(`/blog/${comment.blogId}`);
}

module.exports = {
  renderAddBlogPage,
  createBlog,
  getBlogById,
  addCommentbyBlogId,
  updateBlogById,
  deleteBlogById,
  deleteBlogCommentById,
  editBlogCommentById,
};

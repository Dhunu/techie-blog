import { Router } from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/blog.js";
import Comment from "../models/comment.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`./public/uploads`));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findById(id).populate("createdBy");
    const comments = await Comment.find({ blogId: id }).populate("createdBy");
    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    });
});

router.post("/", upload.single("cover-image"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogId}`);
});

export default router;

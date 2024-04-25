import { Router } from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/blog.js";

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

router.post("/", upload.single("cover-image"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${blog_id}`);
});

export default router;

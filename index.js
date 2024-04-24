import express from "express";
import { resolve } from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.js";
import { checkForAuthCookie } from "./middlewares/authentication.js";

dotenv.config({
    path: resolve(".env.local"),
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("blog-token"));

const port = process.env.PORT || 3000;

const dbStatus = await mongoose.connect(process.env.MONGODB_URI);
if (dbStatus) {
    console.log("Database connected successfully");
} else {
    console.log("Database connection failed");
}

app.set("view engine", "ejs");
app.set("views", resolve("./views"));

app.get("/", (req, res) => {
    res.render("home", {
        user: req.user,
    });
});

app.use("/user", userRoutes);

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
});

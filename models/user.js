import { Schema, model } from "mongoose";

import { createHmac, randomBytes } from "crypto";
import { createUserToken } from "../services/authentication.js";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        profileImageUrl: {
            type: String,
            default: "/images/avatar.png",
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static(
    "matchPasswordAndGenerateToken",
    async function (email, password) {
        const user = await this.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const salt = user.salt;
        const hashedPassword = user.password;

        const userProvidedHash = createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== userProvidedHash)
            throw new Error("Invalid credentials");

        return createUserToken(user);
    }
);

const User = model("User", userSchema);

export default User;

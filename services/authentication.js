import jwt from "jsonwebtoken";

const secret = "mysecretkey";

function createUserToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };

    return jwt.sign(payload, secret, {
        expiresIn: "7d",
    });
}

function validateToken(token) {
    return jwt.verify(token, secret);
}

export { createUserToken, validateToken };

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/userModel.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

const randomHashedPassword = async () =>
  bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

// POST /api/auth/google
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.json({ success: false, message: "Google credential missing" });
    }

    // Google signs this token. We verify the signature and that it was
    // issued for OUR client ID, so the email can be trusted.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.json({
        success: false,
        message: "Your Google email is not verified",
      });
    }

    const email = payload.email.toLowerCase();

    // find by email (case-insensitive), or create a new account
    let user = await userModel
      .findOne({ email })
      .collation({ locale: "en", strength: 2 });

    if (user && user.blocked) {
      return res.json({ success: false, message: "Your account is blocked" });
    }

    if (!user) {
      user = await userModel.create({
        name: payload.name || email.split("@")[0],
        email,
        password: await randomHashedPassword(),
        role: "user",
        isVerified: true,
      });
    } else if (!user.isVerified) {
      // Google proved this email belongs to the person signing in.
      // Replace any password set earlier on the unverified account so
      // nobody who pre-registered this email can still log in with it.
      user.password = await randomHashedPassword();
      user.isVerified = true;
      await user.save();
    }

    // same response shape as your loginUser
    const token = createToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Google sign-in failed" });
  }
};

export { googleLogin };

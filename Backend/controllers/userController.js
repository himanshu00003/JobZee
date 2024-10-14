import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = async (req, res, next) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !phone || !role || !password) {
    return next(new ErrorHandler("Please fill full registration form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already exists"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    role,
    password,
  });
  sendToken(user, 200, res, "User Registered Successfully ");
};

export const login = async (req, res, next) => {
  const { email, password, role } = req.body;
  console.log(email, password);

  if (!email || !password || !role) {
    return next(
      new ErrorHandler("Please provide email, password and role", 400),
    );
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or password", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }
  if (user.password !== password) {
    return next(new ErrorHandler("Invalid Email or password", 400));
  }
  sendToken(user, 200, res, "User logged in successfully!");
};

export const logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(0), // Set the expiration to the past to clear the cookie
        httpOnly: false,
        secure: true, // Ensure the cookie is only sent over HTTPS in production
        sameSite: "none",
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (err) {
    console.error("Logout error", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getUser = async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
};

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// ===============================
// Register User
// POST /api/users/register
// ===============================
export const registerUser = asyncHandler (async (req, res) => {
  try{
  const { name, email, password ,role} = req.body;
  console.log("register Data:" , req.body);
  

  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    isAdmin: role === "admin" ? true : false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  }
  } catch (error) {
    console.log("Register Error:",error)
    res.status(500).json({ message: error.message });
    
  }
});

// ===============================
// Login User
// POST /api/users/login
// ===============================
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
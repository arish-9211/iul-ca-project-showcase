require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
    }

    if (password.length < 12) {
      throw new Error("Admin password must be at least 12 characters");
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      console.log("Admin/user with this email already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "Administrator",
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully");
  } catch (error) {
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();

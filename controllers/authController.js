import User from "../models/User.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  try {
    //fetch details from the request body
    const { name, email, password, phone, address, question } = req.body;

    //check if an user already exists with the given credentials
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    //hash the password

    const hashedPassword = await hashPassword(password);

    //create user with the given data
    const user = await new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      question,
    }).save();

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "user cannot be registered",
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).json({
        success: false,
        message: "Invalid Password",
      });
    }

    //create a JWT TOKEN
    //payload is data to be sent inside JWT Token

    const payload = {
      role: user.role,
      id: user._id,
    };
    const token = await JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Logged in SUCCESSFULLY",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        id: user._id,
      },
      token,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "user cannot be loggedin",
    });
  }
};
//forgot password controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;

    if (!email || !question || !newPassword) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    const user = await User.findOne({ email, question });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Wrong Email or answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await User.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while Updating profile",
      error,
    });
  }
};
export const testController = async (req, res) => {
  res.send("Protected Routes");
};
export const getOrdersController = async (req, res) => {
  try {
   /* const userId = req.user.id; // Assuming req.user contains the logged-in user's information
   // console.log("user id", userId);*/

    const orders = await orderModel
      .find({buyer:req.user.id})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
     // .populate("Products", "-photo")
      //.populate("buyer", "name");
    console.log("orders=", orders);
    // const orders = await orderModel
    // .find({ buyer: req.user._id })
    //.populate("products", "-photo")
    // .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while retrieving orders",
      error,
    });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};

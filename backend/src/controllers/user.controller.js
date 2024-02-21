import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    if ([username, password, fullName].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
      throw new ApiError(409, "User with username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0];

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
      fullName,
      password,
      avatar: avatar.url,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User register successfully"));
  } catch (err) {
    console.log("Registration Error:", err.message);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ApiError(400, "Username and password is required");
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(404, "User doesn't exists");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const token = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user.id).select(
      "-password -refreshToken"
    );
    if (!loggedInUser) {
      throw new ApiError(404, "User doesn't exists");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { token }, "Login Successful"));
  } catch (err) {
    console.log("Login Error:", err.message);
  }
};

const logout = async (req, res) => {
  console.log("logout req.user:", req.user);
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      { $set: { refreshToken: undefined } },
      { new: true }
    );

    return res
      .status(200)
      .clearCookie("token")
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (err) {
    console.log("Logout Error:", err.message);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findById(id);

    if (!user) {
      throw new ApiError(404, "User doesn't exists");
    }

    const data = {
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      id: user.id,
    };
    return res.status(200).json(new ApiResponse(200, data, "success"));
  } catch (err) {
    console.log("getUser Error:", err.message);
  }
};

export { register, login, logout, getUser };

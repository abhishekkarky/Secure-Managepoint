const bcrypt = require("bcrypt");
const users = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MP_USER_EMAIL}`,
    pass: `${process.env.MP_EMAIL_PASS}`,
  },
});

const createUser = async (req, res) => {
  console.log(req.body);

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(403).json({
      success: false,
      message: "Please enter all fields",
    });
  }

  try {
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exists",
      });
    }
    const generateSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, generateSalt);

    const newUser = new users({
      fullName: fullName,
      email: email,
      password: encryptedPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please enter all fields",
      });
    }

    const user = await users.findOne({ email: email });
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN_SECRET);

    res.status(200).json({
      success: true,
      token: token,
      message: "Welcome",
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateUser = async (req, res) => {
  console.log(req.body);

  const { fullName, email, address, number } = req.body;

  const id = req.params.id;
  if (!fullName || !email || !address || !number) {
    res.status(403).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  try {
    const updatedUser = {
      fullName: fullName,
      email: email,
      address: address,
      number: number,
    };
    const user = await users.findByIdAndUpdate(id, updatedUser);
    res.status(200).json({
      success: true,
      message: "User Details updated Successfully",
      user: user,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    console.log(req.body);

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.json({
        success: false,
        message: "Please enter both old and new passwords",
      });
    }

    const id = req.params.id;

    const user = await users.findById(id);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid current password",
      });
    }

    const generateSalt = await bcrypt.genSalt(10);
    const encryptedNewPassword = await bcrypt.hash(newPassword, generateSalt);

    await users.findByIdAndUpdate(id, { password: encryptedNewPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpTimestamp = Date.now() + 120 * 1000;

    await user.save();

    const templatePath = path.resolve(
      __dirname,
      "../templates/otpTemplates.html"
    );
    const template = fs.readFileSync(templatePath, "utf-8");

    const html = template.replace("{otp}", otp);

    const mailOptions = {
      from: "info.managepoint@gmail.com",
      to: email,
      subject: "Password Reset",
      html: html,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res
          .status(403)
          .json({ success: false, message: "Failed to send OTP" });
      }
      res.status(200).json({ success: true, message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User not found" });
    }

    if (!user.otp) {
      return res.status(403).json({
        success: false,
        message: "Please enter OTP...",
      });
    }

    if (user.otp !== otp) {
      return res.status(403).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpTimestamp < Date.now()) {
      return res.status(403).json({ success: false, message: "Expired OTP" });
    }

    const generateSalt = await bcrypt.genSalt(10);
    const encryptedNewPassword = await bcrypt.hash(newPassword, generateSalt);

    user.password = encryptedNewPassword;
    user.otp = undefined;
    user.otpTimestamp = undefined;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const userId = req.params.userId;
    const subscriberId = req.params.subscriberId;

    const user = await users.findById(userId);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    user.subscribers.pull(subscriberId);

    await user.save();

    return res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadImage = async (req, res) => {
  const userImage = req.file;
  const id = req.params.id;
  console.log(req.body);

  if (!userImage) {
    return res.status(403).json({
      success: false,
      message: "Please provide an image!",
    });
  }

  try {
    const uploadedImage = userImage.originalname;
    const userImageUrl = `${process.env.BACKEND_URL + process.env.PORT}/uploads/${uploadedImage}`;

    const user = await users.findByIdAndUpdate(id, { userImageUrl });

    res.status(200).json({
      success: true,
      message: "User image updated successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const userDetail = await users.findById(id);
    res.status(200).json({
      success: true,
      message: "User Details fetched successfully",
      userDetail: userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getGrowthRate = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await users.findById(userId);

    const growthRate = user.growth;
    console.log(growthRate);
    res.status(200).json({
      success: true,
      message: "Growth Rate Fetched Successfully",
      growthRate: growthRate,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
    console.log(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  updateUserPassword,
  forgotPassword,
  resetPassword,
  unsubscribe,
  uploadImage,
  getUserById,
  getGrowthRate,
};

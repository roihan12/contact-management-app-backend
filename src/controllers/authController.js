import { Op } from "sequelize";
import User from "../models/userModel.js";
import sequelize from "../utils/db.js";
import { sendEmail } from "../utils/sendMail.js";
import { dataValid } from "../validation/dataValidation.js";
import { compare } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const register = async (req, res, next) => {
  const t = await sequelize.transaction();
  const valid = {
    fullName: "required",
    email: "required,isEmail",
    password: "required,isStrongPassword",
  };
  try {
    const userReq = await dataValid(valid, req.body);
    if (userReq.validateMessage.length > 0) {
      return res.status(400).json({
        errors: userReq.validateMessage,
        message: "Register failed",
        data: null,
      });
    }
    const userExists = await User.findAll({
      where: {
        email: userReq.data.email,
      },
    });
    if (userExists.length > 0 && userExists[0].isActive) {
      return res.status(400).json({
        errors: ["Email already activated, please use another email address!"],
        message: "Register failed",
        data: null,
      });
    } else if (
      userExists.length > 0 &&
      !userExists[0].isActive &&
      Date.parse(userExists[0].expireTime) > new Date()
    ) {
      return res.status(400).json({
        errors: ["Email already registered, please check your email!"],
        message: "Register failed",
        data: null,
      });
    } else {
      User.destroy(
        {
          where: {
            email: userReq.data.email,
          },
        },
        {
          transaction: t,
        }
      );
    }
    const newUser = await User.create(
      {
        ...userReq.data,
        expireTime: new Date(),
      },
      {
        transaction: t,
      }
    );
    const payloadEmail = {
      fullName: newUser.fullName,
      email: newUser.email,
      token: newUser.userId,
    };
    const result = await sendEmail(payloadEmail);
    if (!result) {
      await t.rollback();
      return res.status(500).json({
        errors: ["Send email failed"],
        message: "Register failed",
        data: null,
      });
    } else {
      await t.commit();
      res.status(201).json({
        errors: null,
        mesage: "User created successfully, please check your email!",
        data: {
          userId: newUser.userId,
          fullName: newUser.fullName,
          email: newUser.email,
          createdAt: newUser.createdAt,
          expireTime: newUser.expireTime,
        },
      });
    }
  } catch (error) {
    await t.rollback();
    next(
      new Error("controllers/authController.js:register - " + error.message)
    );
  }
};

const activationAccount = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      where: {
        userId: userId,
        isActive: false,
        expireTime: {
          [Op.gte]: new Date(),
        },
      },
    });
    if (!user) {
      return res.status(404).json({
        errors: ["User not found or expired"],
        message: "Activation account failed",
        data: null,
      });
    } else {
      user.isActive = true;
      user.expireTime = null;
      await user.save();
      return res.status(200).json({
        errors: [],
        mesage: "Activation account successfully",
        data: {
          fullName: user.fullName,
          email: user.email,
        },
      });
    }
  } catch (error) {
    next(
      new Error(
        "controllers/authController.js:activationAccount - " + error.message
      )
    );
  }
};
const login = async (req, res, next) => {
  try {
    const valid = {
      email: "required, isEmail",
      password: "required",
    };
    const user = await dataValid(valid, req.body);
    const data = user.data;
    if (user.validateMessage.length > 0) {
      return res.status(400).json({
        errors: user.validateMessage,
        message: "Login failed",
        data: null,
      });
    }
    const userExists = await User.findOne({
      where: {
        email: data.email,
        isActive: true,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        errors: [" User not found"],
        message: "Login failed",
        data: data,
      });
    }
    if (compare(data.password, userExists.password)) {
      const userResponse = {
        userId: userExists.userId,
        fullName: userExists.fullName,
        email: userExists.email,
      };

      const token = generateAccessToken(userResponse);
      const refreshToken = generateRefreshToken(userResponse);
      return res.status(200).json({
        errors: [],
        message: "Login successfully",
        data: userResponse,
        accessToken: token,
        refreshToken: refreshToken,
      });
    } else {
      return res.status(400).json({
        errors: ["Email or password wrong"],
        message: "Login failed",
        data: data,
      });
    }
  } catch (error) {
    next(new Error("controllers/authController.js:login - " + error.message));
  }
};
export { register, activationAccount, login };

import { Entropy, charset32 } from "entropy-string";
import User from "../models/userModel.js";
import sequelize from "../utils/db.js";
import { dataValid } from "../validation/dataValidation.js";
import { isExists } from "../validation/sanitization.js";
import { sendEmailForgotPassword } from "../utils/sendMail.js";

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const valid = {};

    if (isExists(req.body.name)) {
      valid.name = "required";
    }
    if (isExists(req.body.email)) {
      valid.email = "required,isEmail";
    }

    if (isExists(req.body.password)) {
      valid.password = "required, isStrongPassword";
      valid.confirmPassword = "required";
    }
    const user = await dataValid(valid, req.body);
    if (
      isExists(user.data.password) &&
      user.data.password !== user.data.confirmPassword
    ) {
      user.validateMessage.push("Passwords not match");
    }

    if (user.validateMessage.length > 0) {
      return res.status(400).json({
        errors: user.validateMessage,
        message: "Update user failed",
        data: null,
      });
    }
    const result = await User.update(
      {
        ...user.data,
      },
      {
        where: {
          userId: userId,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Update user failed",
        data: null,
      });
    } else {
      return res.status(200).json({
        errors: [],
        message: "Update user successfully",
        data: user.data,
      });
    }
  } catch (error) {
    next(
      new Error("controllers/userController.js:updateUser - " + error.message)
    );
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userDelete = await User.destroy({
      where: {
        userId: userId,
      },
    });
    if (!userDelete) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Delete user failed",
        data: null,
      });
    } else {
      return res.status(200).json({
        errors: [],
        message: "Delete user successfully",
        data: null,
      });
    }
  } catch (error) {
    next(
      new Error("controllers/userController.js:deleteUser - " + error.message)
    );
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: {
        userId: userId,
      },
    });
    if (!user) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Get user failed",
        data: null,
      });
    } else {
      const userResponse = {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      };
      return res.status(200).json({
        errors: [],
        message: "Get user successfully",
        data: userResponse,
      });
    }
  } catch (error) {
    next(new Error("controllers/userController.js:getUser - " + error.message));
  }
};
const forgotPassword = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const valid = {
      email: "required, isEmail",
    };

    const userData = await dataValid(valid, req.body);
    if (userData.validateMessage.length > 0) {
      return res.status(400).json({
        errors: userData.validateMessage,
        message: "Forgot password failed",
        data: null,
      });
    }

    const user = await User.findOne({
      where: {
        email: userData.data.email,
      },
    });
    if (!user) {
      return res.status(404).json({
        errors: ["User not found"],
        message: "Forgot password failed",
        data: null,
      });
    }
    const random = new Entropy({ bits: 60, charset: charset32 });
    const stringPassword = random.string();
    await User.update(
      {
        password: stringPassword,
      },
      {
        where: {
          userId: user.userId,
        },
        transaction: t,
      }
    );
    const payloadEmail = {
      fullName: user.fullName,
      email: user.email,
      password: stringPassword,
    };
    const result = await sendEmailForgotPassword(payloadEmail);
    if (!result) {
      await t.rollback();
      return res.status(500).json({
        errors: ["Send email forgot password failed"],
        message: "Forgot password failed",
        data: null,
      });
    } else {
      await t.commit();
      res.status(200).json({
        errors: null,
        mesage: "Forgot password success, please check your email!",
        data: null,
      });
    }
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/userController.js:forgotPassword - " + error.message
      )
    );
  }
};

export { updateUser, deleteUser, getUser, forgotPassword };

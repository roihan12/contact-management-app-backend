import User from "../models/userModel.js";
import { dataValid } from "../validation/dataValidation.js";
import { isExists } from "../validation/sanitization.js";

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
      new Error("controllers/authController.js:updateUser - " + error.message)
    );
  }
};

export { updateUser };

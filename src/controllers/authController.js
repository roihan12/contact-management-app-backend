import User from "../models/userModel.js";
import sequelize from "../utils/db.js";

const register = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const userReq = req.body;
    const userExists = await User.findAll({
      where: {
        email: userReq.email,
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
      User.destroy({
        where: {
          email: userReq.email,
        },
      });
    }

    const newUser = await User.create(
      {
        ...userReq,
        expireTime: new Date(),
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json({
      errors: null,
      mesage: "User created successfully",
      data: {
        userId: newUser.userId,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
        expireTime: newUser.expireTime,
      },
    });
  } catch (error) {
    next(
      new Error("controllers/authController.js:register: - " + error.message)
    );
  }
};

export { register };

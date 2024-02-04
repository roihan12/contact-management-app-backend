import User from "../models/userModel.js";
import sequelize from "../utils/db.js";

const register = async (req, res, next) => {
  try {
    const t = await sequelize.transaction();
    const userReq = req.body;
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
        expireTime: newUser.expireTime,
      },
    });
  } catch (error) {
    next(new Error("controllers/authController.js:register: " + error.message));
  }
};

export { register };

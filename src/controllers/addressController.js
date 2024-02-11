import Address from "../models/addressModel.js";
import sequelize from "../utils/db.js";
import { dataValid } from "../validation/dataValidation.js";

const createAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const contactId = req.params.id;
    const valid = {
      addressType: "required",
      street: "required",
    };

    const address = await dataValid(valid, req.body);
    if (address.validateMessage.length > 0) {
      return res.status(400).json({
        errors: address.validateMessage,
        message: "Create address failed",
        data: address.data,
      });
    }

    const newAddress = await Address.create(
      {
        ...address.data,
        contactId,
      },
      {
        transaction: t,
      }
    );

    if (!newAddress) {
      await t.rollback();
      return res.status(404).json({
        errors: ["Contact not found"],
        message: "Create address failed",
        data: null,
      });
    }
    await t.commit();
    return res.status(200).json({
      errors: [],
      message: "Create address sucessfully",
      data: newAddress,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/addressController.js:createAddress - " + error.message
      )
    );
  }
};

const getAddress = async (req, res, next) => {
  try {
    const address = await Address.findAll({});
    if (!address) {
      return res.status(404).json({
        errors: ["Address not found"],
        message: "Get address failed",
        data: null,
      });
    }
    return res.status(200).json({
      errors: [],
      message: "Get address sucessfully",
      data: address,
    });
  } catch (error) {
    next(
      new Error(
        "controllers/addressController.js:getAddress - " + error.message
      )
    );
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const address = await Address.findOne({
      where: {
        addressId: id,
      },
    });

    if (!address) {
      return res.status(404).json({
        errors: ["Address not found"],
        message: "Get address by id failed",
        data: null,
      });
    }
    return res.status(200).json({
      errors: [],
      message: "Get address by id sucessfully",
      data: address,
    });
  } catch (error) {
    next(
      new Error(
        "controllers/addressController.js:getAddressById - " + error.message
      )
    );
  }
};

const updateAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const valid = {
      addressType: "required",
      street: "required",
    };
    const address = await dataValid(valid, req.body);
    if (address.validateMessage.length > 0) {
      return res.status(400).json({
        errors: address.validateMessage,
        message: "Update address failed",
        data: address.data,
      });
    }

    const addressUpdate = await Address.update(
      { ...address.data },
      {
        where: {
          addressId: id,
        },
        transaction: t,
      }
    );

    if (!addressUpdate) {
      await t.rollback();
      return res.status(404).json({
        errors: ["Address not found"],
        message: "Update address failed",
        data: null,
      });
    }
    await t.commit();
    return res.status(404).json({
      errors: [],
      message: "Update address successfully",
      data: address.data,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/addressController.js:updateAddress - " + error.message
      )
    );
  }
};

const deleteAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const addressDelete = await Address.destroy({
      where: {
        addressId: id,
      },
      transaction: t,
    });

    if (!addressDelete) {
      await t.rollback();
      return res.status(404).json({
        errors: ["Address not found"],
        message: "Delete address failed",
        data: null,
      });
    }

    await t.commit();
    return res.status(200).json({
      errors: [],
      message: "Delete address successfully",
      data: null,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/contactController.js:deleteAddress - " + error.message
      )
    );
  }
};
export {
  getAddress,
  getAddressById,
  updateAddress,
  createAddress,
  deleteAddress,
};

import { Op } from "sequelize";
import Address from "../models/addressModel.js";
import Contact from "../models/contactModel.js";
import sequelize from "../utils/db.js";
import { dataValid } from "../validation/dataValidation.js";
import { isExists } from "../validation/sanitization.js";

const createContact = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    let listError = [];
    let contact = req.body;
    let address = [];
    if (isExists(contact.Addresses)) {
      address = contact.Addresses;
    }
    delete contact.Addresses;
    // rule Validasi contact
    const validContact = {
      firstName: "required",
    };

    contact = await dataValid(validContact, contact);
    listError.push(...contact.validateMessage);
    let addressValidate = await Promise.all(
      address.map(async (item) => {
        const addressClear = await dataValid(
          {
            addressType: "required",
            street: "required",
          },
          item
        );
        listError.push(...addressClear.validateMessage);
        return addressClear.data;
      })
    );

    contact = {
      ...contact.data,
      userId: req.user.userId,
      Addresses: addressValidate,
    };
    // error handle
    if (listError.length > 0) {
      return res.status(400).json({
        errors: listError,
        message: "Create contact failed",
        data: contact,
      });
    }

    const newContact = await Contact.create(contact, {
      transaction: t,
    });

    const newAddress = await Promise.all(
      contact.Addresses.map(async (address) => {
        return await Address.create(
          {
            ...address,
            contactId: newContact.contactId,
          },
          {
            transaction: t,
          }
        );
      })
    );

    if (!newContact || !newAddress) {
      await t.rollback();
      return res.status(404).json({
        errors: ["Contact not found"],
        message: "Create contact failed",
        data: null,
      });
    }
    await t.commit();
    return res.status(201).json({
      errors: [],
      message: "Create contact successfully",
      data: { ...newContact.dataValues, address: newAddress },
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/contactController.js:createContact - " + error.message
      )
    );
  }
};
const getContact = async (req, res, next) => {
  try {
    const contacts = req.body;
    let address = [];
    if (isExists(contacts.Addresses)) {
      address = contacts.Addresses;
      delete contacts.Addresses;
    }
    // filter Addresses
    let objAddressFilter = [];
    const filterAddress = await new Promise((resolve, reject) => {
      Object.entries(address).forEach(([key, value]) => {
        objAddressFilter = {
          ...objAddressFilter,
          [key]: {
            [Op.like]: "%" + value + "%",
          },
        };
      });
      resolve(objAddressFilter);
    });

    // filter contact
    let objContactFilter = [];
    const filterContact = await new Promise((resolve, reject) => {
      Object.entries(contacts).forEach(([key, value]) => {
        objContactFilter = {
          ...objContactFilter,
          [key]: {
            [Op.like]: "%" + value + "%",
          },
        };
      });
      resolve(objContactFilter);
    });

    // check filter
    let data = null;
    if (Object.keys(filterAddress).length === 0) {
      data = await Contact.findAll({
        include: {
          model: Address,
        },
        where: filterContact,
      });
    } else {
      data = await Contact.findAll({
        include: {
          model: Address,
          where: filterAddress,
        },
        where: filterContact,
      });
    }

    return res.status(200).json({
      errors: [],
      message: "Get contacts successfully",
      data: data,
    });
  } catch (error) {
    next(
      new Error(
        "controllers/contactController.js:getContact - " + error.message
      )
    );
  }
};

const getContactById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findOne({
      include: {
        model: Address,
      },
      where: {
        contactId: id,
      },
    });
    if (!contact) {
      return res.status(404).json({
        errors: ["Contact not found"],
        message: "Get contact failed",
        data: null,
      });
    }

    return res.status(200).json({
      errors: [],
      message: "Get contact successfully",
      data: contact,
    });
  } catch (error) {
    next(
      new Error(
        "controllers/contactController.js:getContactById - " + error.message
      )
    );
  }
};

const updateContact = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    let listError = [];
    const id = req.params.id;
    let contact = req.body;

    let address = [];
    if (isExists(contact.Addresses)) {
      contact.Addresses.forEach((item) => {
        delete item.addressId;
        delete item.contactId;
        address.push(item);
      });
    }

    delete contact.Addresses;
    delete contact.contactId;

    const validContact = {
      firstName: "required",
    };
    contact = await dataValid(validContact, contact);
    listError.push(...contact.validateMessage);
    let addressValidate = await Promise.all(
      address.map(async (item) => {
        const addressClear = await dataValid(
          {
            addressType: "required",
            street: "required",
          },
          item
        );
        listError.push(...addressClear.validateMessage);
        return addressClear.data;
      })
    );

    // error handle
    if (listError.length > 0) {
      await t.rollback();
      return res.status(400).json({
        errors: listError,
        message: "Update contact failed",
        data: contact,
      });
    }
    // update contact
    const updateContact = await Contact.update(
      {
        ...contact.data,
      },
      {
        where: {
          contactId: id,
        },
        transaction: t,
      }
    );

    // delete address
    const addressDelete = await Address.destroy({
      where: {
        contactId: id,
      },
      transaction: t,
    });

    // new address
    const updateAddress = await Promise.all(
      addressValidate.map(async (address) => {
        const result = await Address.create(
          {
            ...address,
            contactId: id,
          },
          {
            transaction: t,
          }
        );
        return result;
      })
    );

    if (!updateContact || !updateAddress || !addressDelete) {
      await t.rollback();
      return res.status(404).json({
        errors: ["Contact not found"],
        message: "Update contact failed",
        data: contact.data,
      });
    }
    await t.commit();
    return res.status(200).json({
      errors: [],
      message: "Update contact successfully",
      data: { ...contact.data, Addresses: updateAddress },
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/contactController.js:updateContact - " + error.message
      )
    );
  }
};
const deleteContact = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    const addressDelete = await Address.destroy({
      where: {
        contactId: id,
      },
      transaction: t,
    });

    const contactDelete = await Contact.destroy({
      where: {
        contactId: id,
      },
      transaction: t,
    });

    if (!addressDelete || !contactDelete) {
      await t.rollback();
      return res.status(404).json({
        errors: ["Contact not found"],
        message: "Delete contact failed",
        data: null,
      });
    }

    await t.commit();
    return res.status(200).json({
      errors: [],
      message: "Delete contact successfully",
      data: null,
    });
  } catch (error) {
    await t.rollback();
    next(
      new Error(
        "controllers/contactController.js:deleteContact - " + error.message
      )
    );
  }
};

export {
  createContact,
  getContact,
  getContactById,
  updateContact,
  deleteContact,
};

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
    if (isExists(contact.addresses)) {
      address = contact.addresses;
    }
    delete contact.addresses;
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
      addresses: addressValidate,
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
      contact.addresses.map(async (address) => {
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
      return res.status(400).json({
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
    if (isExists(contacts.addresses)) {
      address = contacts.addresses;
      delete contacts.addresses;
    }
    // filter addresses
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
export { createContact, getContact };

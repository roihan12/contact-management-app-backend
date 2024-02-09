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

export { createContact };

import { Sequelize } from "sequelize";
import sequelize from "../utils/db.js";
import Contact from "./contactModel.js";

const Address = sequelize.define(
  "Address",
  {
    addressId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    addressType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    province: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    zipcode: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "address",
    underscored: true,
    timestamps: true,
  }
);

Contact.hasMany(Address, {
  foreignKey: "contactId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

Address.belongsTo(Contact, {
  foreignKey: "contactId",
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
});

sequelize.sync();

export default Address;

import {
  registerUser,
  registerUserBody,
  activationUserAccount,
  loginUserBody,
  loginUser,
  refreshToken,
} from "./auth.js";

import { getUser, updateUser, updateUserBody, deleteUser } from "./users.js";

import {
  createContact,
  createContactBody,
  getContacts,
  getContact,
  updateContact,
  updateContactBody,
  deleteContact,
} from "./contacts.js";

import {
  createAddress,
  createAddressBody,
  getAddresses,
  getAddress,
  updateAddress,
  updateAddressBody,
  deleteAddress,
} from "./address.js";

const apiDocumentation = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "FlowContact Manager - Documentation",
    description:
      "FlowContact Manager is an efficient and integrated management solution for effortlessly handling contact information. With the provided API documentation, you can connect and interact with the FlowContact Manager system directly from your external applications or platforms.This API enables secure and structured access to key features of FlowContact Manager, including adding, updating, and deleting contacts. Additionally, the API offers functionality for conducting searches, grouping contacts, and obtaining detailed information about each contact entity.",
    contact: {
      name: "Roihan Sori",
      email: "roihansori12@gmail.com",
      url: "https://devwebsite.com",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1/",
      description: "Local Server",
    },
    {
      url: "https://api.mysite.com",
      description: "Production Server",
    },
  ],
  tags: [
    {
      name: "Auth",
    },
    {
      name: "Users",
    },
    {
      name: "Contacts",
    },
    {
      name: "Address",
    },
  ],
  paths: {
    "auth/register": {
      post: registerUser,
    },
    "auth/login": {
      post: loginUser,
    },
    "auth/activation/:uuid": {
      get: activationUserAccount,
    },
    "auth/refresh": {
      post: refreshToken,
    },
    "users/:id": {
      delete: deleteUser,
      get: getUser,
      patch: updateUser,
    },
    contacts: {
      post: createContact,
      get: getContacts,
    },
    "contacts/:id": {
      get: getContact,
      put: updateContact,
      delete: deleteContact,
    },
    address: {
      post: createAddress,
      get: getAddresses,
    },
    "address/:id": {
      get: getAddress,
      put: updateAddress,
      delete: deleteAddress,
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      registerUserBody,
      loginUserBody,
      updateUserBody,
      createContactBody,
      updateContactBody,
      createAddressBody,
      updateAddressBody,
    },
  },
};

export { apiDocumentation };

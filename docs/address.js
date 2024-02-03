const security = [
  {
    bearerAuth: [],
  },
];

const internalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Internal Server Error",
          },
        },
      },
    },
  },
};

const addressNotFound = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            example: ["Address not found"],
          },
          message: {
            type: "string",
            example: "Get address failed",
          },
          data: {
            type: "string",
            example: null,
          },
        },
      },
    },
  },
};

const invalidAddressData = {
  description: "Invalid Data provided",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            example: ["city is requred", "street is required"],
          },
          message: {
            type: "string",
            example: "Create a new address failed",
          },
          data: {
            type: "string",
            example: null,
          },
        },
      },
    },
  },
};

const createAddressBody = {
  type: "object",
  properties: {
    addressType: {
      type: "string",
      example: "Home",
    },

    street: {
      type: "string",
      example: "Jl. absolute street",
    },

    city: {
      type: "string",
      example: "Jakarta Pusat",
    },

    province: {
      type: "string",
      example: "Jakarta",
    },
    country: {
      type: "string",
      example: "Indonesia",
    },
    zipcode: {
      type: "string",
      example: "123456",
    },

    contactId: {
      type: "string",
      example: "fcb655047cdc49fdgdf656",
    },
  },
};

const updateAddressBody = {
  type: "object",
  properties: {
    addressType: {
      type: "string",
      example: "Office",
    },
    street: {
      type: "string",
      example: "Jl. Bandung",
    },
    city: {
      type: "string",
      example: "Bandung",
    },
    province: {
      type: "string",
      example: "Jawa Barat",
    },
    country: {
      type: "string",
      example: "Indonesia",
    },
    zipcode: {
      type: "string",
      example: "456789",
    },
    contactId: {
      type: "string",
      example: "fcb655047cdc49fdgdf656",
    },
  },
};

const addressResponse = {
  id: "55047cdc49fdgfgi2002",
  addressType: "Home",
  street: "Jl. absolute street",
  city: "Jakarta Pusat",
  province: "Jakarta",
  country: "Indonesia",
  zipcode: "123456",
  contactId: "fcb655047cdc49fdgdf656",
};

const addressResponseUpdate = {
  id: "55047cdc49fdgfgi2002",
  addressType: "Office",
  street: "Jl. Bandung",
  city: "Bandung",
  province: "Jawa Barat",
  country: "Indonesia",
  zipcode: "456789",
  contactId: "fcb655047cdc49fdgdf656",
};
const createAddress = {
  tags: ["Address"],
  description: "Create address endpoint",
  operationId: "createAddress",
  security,
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/createAddressBody",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Create address successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              errors: {
                type: "string",
                example: null,
              },
              message: {
                type: "string",
                example: "Create address successfully",
              },
              data: {
                type: "object",
                example: addressResponse,
              },
            },
          },
        },
      },
    },
    400: invalidAddressData,
    500: internalServerError,
  },
};

const getAddresses = {
  tags: ["Address"],
  description: "Get all  or search for contacts",
  operationId: "getAddresses",
  security: [
    {
      bearerAuth: [],
    },
  ],

  responses: {
    200: {
      description: "Get all address successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              errors: {
                type: "string",
                example: null,
              },
              message: {
                type: "string",
                example: "Get all address successfully",
              },
              data: {
                type: "array",
                example: [addressResponse, addressResponse],
              },
            },
          },
        },
      },
    },
    404: addressNotFound,
    500: internalServerError,
  },
};

const getAddress = {
  tags: ["Address"],
  description: "Get one address",
  operationId: "getAdress",
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "Address ID",
      required: true,
      type: "string",
    },
  ],

  responses: {
    200: {
      description: "Get address successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              errors: {
                type: "string",
                example: null,
              },
              message: {
                type: "string",
                example: "Get address successfully",
              },
              data: {
                type: "object",
                example: addressResponse,
              },
            },
          },
        },
      },
    },
    404: addressNotFound,
    500: internalServerError,
  },
};

const updateAddress = {
  tags: ["Address"],
  description: "Update a address",
  operationId: "updateAddress",
  security,
  parameters: [
    {
      name: "id",
      in: "path",
      description: "Address ID",
      required: true,
      type: "string",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateAddressBody",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Update address successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              errors: {
                type: "string",
                example: null,
              },
              message: {
                type: "string",
                example: "Update address successfully",
              },
              data: {
                type: "object",
                example: addressResponseUpdate,
              },
            },
          },
        },
      },
    },
    404: addressNotFound,
    500: internalServerError,
  },
};

const deleteAddress = {
  tags: ["Address"],
  description: "Delete a address",
  operationId: "deleteAddress",
  security,
  parameters: [
    {
      name: "id",
      in: "path",
      description: "Address ID",
      required: true,
      type: "string",
    },
  ],
  responses: {
    200: {
      description: "Delete address successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              errors: {
                type: "string",
                example: null,
              },
              message: {
                type: "string",
                example: "Delete address successfully",
              },
              data: {
                type: "object",
                example: null,
              },
            },
          },
        },
      },
    },
    404: addressNotFound,
    500: internalServerError,
  },
};

export {
  createAddress,
  createAddressBody,
  getAddresses,
  getAddress,
  updateAddress,
  updateAddressBody,
  deleteAddress,
};

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

const contactNotFound = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            example: ["Contact not found"],
          },
          message: {
            type: "string",
            example: "Get contact failed",
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

const invalidContactData = {
  description: "Invalid Data provided",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            example: ["firstName is requred", "email is required"],
          },
          message: {
            type: "string",
            example: "Create a new contact failed",
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

const createContactBody = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      example: "Jane",
    },
    lastName: {
      type: "string",
      example: "Doe",
    },
    email: {
      type: "string",
      example: "janedoe@example.com",
    },
    phone: {
      type: "string",
      example: "085777333999",
    },
    address: {
      type: "array",
      example: [
        {
          addressType: "Home",
          street: "Jl. absolute street",
          city: "Jakarta Pusat",
          province: "Jakarta",
          country: "Indonesia",
          zipcode: "123456",
          contactId: "fcb655047cdc49fdgdf656",
        },
      ],
    },
  },
};

const ContactResponse = {
  id: "fcb655047cdc49fdgdf656",
  firstName: "Jane",
  lastName: "Doe",
  email: "janedoe@example.com",
  phone: "085777333999",
  address: [
    {
      addressType: "Home",
      street: "Jl. absolute street",
      city: "Jakarta Pusat",
      province: "Jakarta",
      country: "Indonesia",
      zipcode: "123456",
      contactId: "fcb655047cdc49fdgdf656",
    },
  ],
  userId: "60564fcb544047cdc3844818",
};

const createContact = {
  tags: ["Contacts"],
  description: "Create contact endpoint",
  operationId: "createContact",
  security,
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/createContactBody",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Create contact successfully",
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
                example: "Create contact successfully",
              },
              data: {
                type: "object",
                example: ContactResponse,
              },
            },
          },
        },
      },
    },
    400: invalidContactData,
    500: internalServerError,
  },
};

const getContacts = {
  tags: ["Contacts"],
  description: "Get all contact or search for contacts",
  operationId: "getContacts",
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: "search",
      in: "query",
      description: "Search contact",
      type: "string",
    },
  ],

  responses: {
    200: {
      description: "Get Contacts successfully",
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
                example: "Get Contacts successfully",
              },
              data: {
                type: "array",
                example: [ContactResponse, ContactResponse],
              },
            },
          },
        },
      },
    },
    404: contactNotFound,
    500: internalServerError,
  },
};

const getContact = {
    tags: ["Contacts"],
    description: "Get one contact",
    operationId: "getContact",
    security: [
      {
        bearerAuth: [],
      },
    ],
    parameters: [
        {
          name: "id",
          in: "path",
          description: "Contact ID",
          required: true,
          type: "string",
        },
      ],
  
    responses: {
      200: {
        description: "Get Contact successfully",
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
                  example: "Get Contact successfully",
                },
                data: {
                  type: "object",
                  example: ContactResponse,
                },
              },
            },
          },
        },
      },
      404: contactNotFound,
      500: internalServerError,
    },
  };

export { createContact, createContactBody, getContacts,getContact };

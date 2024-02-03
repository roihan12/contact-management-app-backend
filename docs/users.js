const userResponse = {
  id: "60564fcb544047cdc3844818",
  fullName: "John doe",
  email: "johndoe@gmail.com",
  createdAt: "2021-03-20T19:40:59.495Z",
  updatedAt: "2021-03-20T21:23:10.879Z",
};

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

const userNotFound = {
  description: "Resource not found",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            example: ["User with id: 71675fcb655047cdc4955929 not found"],
          },
          message: {
            type: "string",
            example: "Get user failed",
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

const invalidUserData = {
  description: "Invalid Data provided",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          errors: {
            type: "array",
            example: ["Email is requred", "Password is required"],
          },
          message: {
            type: "string",
            example: "The fields field1, field2 and field3 are required",
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

const security = [
  {
    bearerAuth: [],
  },
];

const updateUserBody = {
  type: "object",
  properties: {
    fullName: {
      type: "string",
      example: "John Snow",
    },
    email: {
      type: "string",
      example: "john@example.com",
    },
    password: {
      type: "string",
      example: "password",
    },
  },
};

const getUser = {
  tags: ["Users"],
  description: "Retrieve one user",
  operationId: "getUser",
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "User ID",
      required: true,
      type: "string",
    },
  ],
  responses: {
    200: {
      description: "Get user successfully",
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
                example: "Get user successfully",
              },
              data: {
                type: "object",
                example: userResponse,
              },
            },
          },
        },
      },
    },
    404: userNotFound,
    500: internalServerError,
  },
};

const updateUser = {
  tags: ["Users"],
  description: "Update a user",
  operationId: "updateUser",
  security,
  parameters: [
    {
      name: "id",
      in: "path",
      description: "User ID",
      required: true,
      type: "string",
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/updateUserBody",
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "Update user successfully",
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
                example: "Update user successfully",
              },
              data: {
                type: "object",
                example: userResponse,
              },
            },
          },
        },
      },
    },
    404: userNotFound,
    422: invalidUserData,
    500: internalServerError,
  },
};

const deleteUser = {
  tags: ["Users"],
  description: "Delete a user",
  operationId: "deleteUser",
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "User ID",
      required: true,
      type: "string",
    },
  ],
  responses: {
    200: {
      description: "User deleted successfully",
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
                example: "deleted user successfully",
              },
              data: {
                type: "string",
                example: null,
              },
            },
          },
        },
      },
    },
    500: {
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
    },
  },
};

export { deleteUser, getUser, updateUserBody, updateUser };

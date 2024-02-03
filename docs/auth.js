const activationAccountResponse = {
    errors: {
      type: "string",
      example: null,
    },
    message: {
      type: "string",
      example: "Activation account successfully",
    },
  
    data: {
      type: "array",
      example: [
        {
          id: "60564fcb544047cdc3844818",
          fullName: "John Doe",
          email: "johndoe@gmail.com",
          createdAt: "2021-03-20T19:40:59.495Z",
          updatedAt: "2021-03-20T21:23:10.879Z",
        },
      ],
    },
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
  const activatioAccountExpireResponse = {
    description: "Activation Account Expire",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            errors: {
              type: "array",
              example: ["Activation account ise expired"],
            },
            message: {
              type: "string",
              example: "Process failed",
            },
            data: {
              type: "object",
              example: null,
            },
          },
        },
      },
    },
  };

  const registerUserBody = {
    type: "object",
    properties: {
      fullName: {
        type: "string",
        example: "John Doe",
      },
      email: {
        type: "string",
        example: "johndoe@gmail.com",
      },
      password: {
        type: "string",
        description: "unencrypted user's password",
        example: "!1234aWe1Ro3$#",
      },
    },
  };
  const loginUserBody = {
    type: "object",
    properties: {
      email: {
        type: "string",
        example: "johndoe@gmail.com",
      },
      password: {
        type: "string",
        description: "unencrypted user's password",
        example: "!1234aWe1Ro3$#",
      },
    },
  };
  


  const registerUser = {
    tags: ["Auth"],
    description: "Register a new user in the system",
    operationId: "registerUser",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/registerUserBody",
          },
        },
      },
      required: true,
    },
    responses: {
      201: {
        description: "User created successfully!",
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
                  example:
                    "activation account already sent to your email address",
                },
                data: {
                  type: "array",
                  example: [
                    {
                      id: "60564fcb544047cdc3844818",
                      fullName: "John Doe",
  
                      email: "johndoe@gmail.com",
  
                      createdAt: "2021-03-20T19:40:59.495Z",
  
                      updatedAt: "2021-03-20T21:23:10.879Z",
                    },
                  ],
                },
              },
            },
          },
        },
      },
      400: invalidUserData,
      500: internalServerError,
    },
  };
  const loginUser = {
    tags: ["Auth"],
    description: "Endpoint for login user in the system",
    operationId: "loginUser",
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/loginUserBody",
          },
        },
      },
      required: true,
    },
    responses: {
      200: {
        description: "response for user login",
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
                  example: "Login sucessfully",
                },
                data: {
                  type: "array",
                  example: [
                    {
                      id: "60564fcb544047cdc3844818",
                      fullName: "John Doe",
  
                      email: "johndoe@gmail.com",
  
                      createdAt: "2021-03-20T19:40:59.495Z",
  
                      updatedAt: "2021-03-20T21:23:10.879Z",
                    },
                  ],
                },
                access_token: {
                  type: "string",
                  example:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                },
                refresh_token: {
                  type: "string",
                  example:
                    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXI5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.",
                },
              },
            },
          },
        },
      },
      400: {
        description: "Invalid crediential data",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  example: ["Email or password is wrong"],
                },
                message: {
                  type: "string",
                  example: "Login failed",
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
      500: internalServerError,
    },
  };
  
  const activationUserAccount = {
    tags: ["Auth"],
    description: "Activation a new user in the system",
    operationId: "activationUser",
    responses: {
      200: {
        description: "Activation user successfully!",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: activationAccountResponse,
              },
            },
          },
        },
      },
      400: activatioAccountExpireResponse,
      500: internalServerError,
    },
  };
  
  const refreshToken = {
    tags: ["Auth"],
    description: "get a refresh token by access token",
    operationId: "refreshToken",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses: {
      200: {
        description: "Refresh token successfully",
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
                  example: "Login sucessfully",
                },
                data: {
                  type: "array",
                  example: [
                    {
                      id: "60564fcb544047cdc3844818",
                      fullName: "John Doe",
  
                      email: "johndoe@gmail.com",
  
                      createdAt: "2021-03-20T19:40:59.495Z",
  
                      updatedAt: "2021-03-20T21:23:10.879Z",
                    },
                  ],
                },
                access_token: {
                  type: "string",
                  example:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                },
                refresh_token: {
                  type: "string",
                  example:
                    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXI5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.",
                },
              },
            },
          },
        },
      },
      401: {
        description: "Invalid token or expired token",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                errors: {
                  type: "array",
                  example: ["Invalid token"],
                },
                message: {
                  type: "string",
                  example: "Refresh token failed",
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
      500: internalServerError,
    },
  };
  
  export {
    registerUser,
    registerUserBody,
    activationUserAccount,
    loginUserBody,
    loginUser,
    refreshToken
  }
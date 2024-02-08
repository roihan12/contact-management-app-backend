import validator from "validator";
import { isExists, sanitization } from "./sanitization.js";

// const dataValid = async (valid, dt) => {
//   let message = [];
//   let dataDummy = [];
//   let data = await sanitization(dt);
//   const validateMessage = await new Promise((resolve, reject) => {
//     Object.entries(data).forEach(async (item) => {
//       const [key, value] = item;
//       if (isExists(valid[key])) {
//         const validate = valid[key].split(",");
//         dataDummy = await new Promise((resolve, reject) => {
//           let msg = [];
//           validate.forEach((v) => {
//             switch (v) {
//               case "required":
//                 if (isExists(data[key]) && validator.isEmpty(data[key])) {
//                   msg.push(key + " is required");
//                 }
//                 break;

//               case "isEmail":
//                 if (isExists(data[key]) && !validator.isEmail(data[key])) {
//                   msg.push(key + " is not a valid email address");
//                 }
//                 break;

//               case "isStrongPassword":
//                 if (
//                   isExists(data[key]) &&
//                   !validator.isStrongPassword(data[key])
//                 ) {
//                   msg.push(
//                     key +
//                       " most be at least 8 characters, 1 uppercase, 1 lowercase, 1 numbers and 1 symbols"
//                   );
//                 }
//                 break;
//               default:
//                 break;
//             }
//           });
//           resolve(msg);
//         });
//       }
//       message.push(...dataDummy);
//     });
//     resolve(message);
//   });
//   return { validateMessage, data };
// };

const dataValid = async (valid, dt) => {
  let message = [];
  let dataDummy = [];

  let data = await sanitization(dt);

  for (const [key, value] of Object.entries(valid)) {
    // if (isExists(valid[key])) {
    const validate = valid[key].split(",");
    let msg = [];

    for (const v of validate) {
      switch (v) {
        case "required":
          if (!isExists(data[key])) {
            msg.push(key + " is required");
          } else {
            if (isExists(data[key]) && validator.isEmpty(data[key])) {
              msg.push(key + " is required");
            }
          }
          break;

        case "isEmail":
          if (isExists(data[key]) && !validator.isEmail(data[key])) {
            msg.push(key + " is not a valid email address");
          }
          break;

        case "isStrongPassword":
          if (isExists(data[key]) && !validator.isStrongPassword(data[key])) {
            msg.push(
              key +
                " must be at least 8 characters, 1 uppercase, 1 lowercase, 1 numbers and 1 symbols"
            );
          }
          break;

        default:
          break;
      }
    }
    dataDummy.push(...msg);
    // }
  }

  message.push(...dataDummy);

  return { validateMessage: message, data };
};

export { dataValid };

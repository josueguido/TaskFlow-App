// import { BadRequestError } from '../errors/BadRequestError';

// export const isValidUUID = (uuid: string): boolean => {
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//   return uuidRegex.test(uuid);
// };

// export const validateUUID = (uuid: string, fieldName: string = 'ID'): void => {
//   if (!uuid) {
//     throw new BadRequestError(`${fieldName} is required`);
//   }

//   if (!isValidUUID(uuid)) {
//     throw new BadRequestError(`${fieldName} must be a valid UUID`);
//   }
// };

// export const validateUUIDs = (uuids: string[], fieldName: string = 'IDs'): void => {
//   if (!uuids || uuids.length === 0) {
//     throw new BadRequestError(`${fieldName} array cannot be empty`);
//   }

//   uuids.forEach((uuid, index) => {
//     if (!isValidUUID(uuid)) {
//       throw new BadRequestError(`${fieldName}[${index}] must be a valid UUID`);
//     }
//   });
// };

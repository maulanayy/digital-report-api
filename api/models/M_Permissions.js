/**
 * M_Permissions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intPermissionID",
      required: true,
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      columnName: "txtName",
    },
    txtAction: {
      type: "string",
      columnName: "txtAction",
    },
  },
};

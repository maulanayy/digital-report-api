/**
 * M_Roles.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intRoleID",
      required: true,
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      unique: true,
      columnName: "txtName",
    },
  },
};

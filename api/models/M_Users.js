/**
 * M_Users.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intUserID",
      required: true,
      autoIncrement: true,
    },
    txtUsername: {
      type: "string",
      unique: true,
      columnName: "txtUsername",
    },
    txtPassword: {
      type: "string",
      columnName: "txtPassword",
    },
    txtName: {
      type: "string",
      columnName: "txtName",
    },
    intRoleID: {
      type: "number",
      columnName: "intRoleID",
    },
    intLabID: {
      type: "number",
      columnName: "intLabID",
    },
    intControlPointID: {
      type: "number",
      columnName: "intControlPointID",
    },
  },
};

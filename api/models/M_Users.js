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
  
  beforeCreate: function (valuesToSet, proceed) {
    // Hash password

    const password = valuesToSet.txtPassword ? valuesToSet.txtPassword : "";
    sails.helpers.hashPassword(password).exec((err, hashedPassword) => {
      if (err) {
        return proceed(err);
      }
      valuesToSet.txtPassword = hashedPassword;
      return proceed();
    });
  },
};

/**
 * M_Role_Permissions.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id :{
      type : "number",
      columnName : "intRolePermissionID",
      autoIncrement : true,
    },
    intRoleID: {
      type: "number",
      columnName: "intRoleID",
    },
    intPermissionID: {
      type: "number",
      columnName: "intPermissionID",
    },
  },

};


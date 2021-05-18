/**
 * M_User_History.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type : "number",
      columnName: "intUserIDHistory",
      autoIncrement: true,
    },
    intUserID: {
      type : "number",
      columnName: "intUserID",
    },
    txtAction : {
      type : "string",
      columnName : "txtAction"
    }
  },
};


/**
 * M_User_History.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intLabID",
      autoIncrement: true,
    },
    intUserID: {
      type: "number",
      columnName: "intUserID",
    },  
    txtName: {
      type: "string",
      columnName: "txtName",
    },
    txtAction : {
      type: "string",
      columnName: "txtAction",
    }
  },

};


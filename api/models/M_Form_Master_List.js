/**
 * M_Form_Master_List.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormMasterListID",
      autoIncrement: true,
    },
    intFormMasterID : {
      type: "number",
      columnName: "intFormMasterID",
    },
    intFormID: {
      type: "number",
      columnName: "intFormID",
    }
  },

};


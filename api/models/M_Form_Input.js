/**
 * M_Form_Input.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormInputID",
      autoIncrement: true,
    },
    intFormID : {
      type : "number",
      columnName : "intFormID"
    },
    intFormMasterID : {
      type : "number",
      columnName : "intFormMasterID"
    },
    txtOKP : {
      type : "string",
      columnName : "txtOKP"
    }
  },
};


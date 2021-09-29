/**
 * M_Form_Master.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormMasterID",
      autoIncrement: true,
    },
    txtFormName : {
      type : "string",
      required: true,
      columnName: "txtFormName",
    },
    txtNoDok: {
      type: "string",
      required: true,
      columnName: "txtNoDok",
    },
    txtRemark : {
      type : "string",
      columnName : "txtRemark"
    },
    intLabID : {
      type: "number",
      columnName: "intLabID",
    }
  },

};


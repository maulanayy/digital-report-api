/**
 * M_Form.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intFormID",
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
    txtProductName: {
      type: "string",
      required: true,
      columnName: "txtProductName",
    },
    txtOKP: {
      type: "string",
      columnName: "txtOKP",
    },
    
    txtRemark : {
      type : "string",
      columnName : "txtRemark"
    },
    intControlPointID : {
      type: "number",
      columnName: "intControlPointID",
    }
  },
};

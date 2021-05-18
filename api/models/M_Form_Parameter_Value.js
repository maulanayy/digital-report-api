/**
 * M_Form_Parameter_Value.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormValueParameterID",
      autoIncrement: true,
    },
    txtParameterName: {
      type: "string",
      columnName: "txtParameterName",
    },
    intFormInputID : {
      type: "number",
      columnName: "intFormInputID",
    },
    intFormParameterID: {
      type: "number",
      columnName: "intFormParameterID",
    },
    txtParameterValue : {
      type : "string",
      columnName  : "txtParameterValue"
    },
  },

};


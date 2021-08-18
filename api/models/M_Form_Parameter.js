/**
 * M_Form_Parameter.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormParameterID",
      autoIncrement: true,
    },
    intParameterID: {
      type : "string",
      columnName : "intParameterID"
    },
    txtParameterName: {
      type: "string",
      columnName: "txtParameterName",
    },
    intMinValue : {
      type : "number",
      columnName : "intMinValue"
    },
    intMaxValue : {
      type : "number",
      columnName : "intMaxValue"
    },
    intFormID : {
      type : "number",
      columnName : "intFormID"
    }
  },

};


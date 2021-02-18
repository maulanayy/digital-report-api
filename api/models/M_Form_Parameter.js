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
    txtParameterName: {
      type: "string",
      columnName: "txtParameterName",
    },
    intFormID : {
      type : "number",
      columnName : "intFormID"
    }
  },

};


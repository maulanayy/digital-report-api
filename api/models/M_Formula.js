/**
 * M_Formula.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormulaID",
      autoIncrement: true,
    },
    intParameterID: {
      type: "number",
      columnName: "intParameterID",
    },
    intParameterFormulaID: {
      type: "number",
      required: true,
      columnName: "intParameterFormulaID",
    },  
    txtOperator: {
      type: "string",
      required: true,
      columnName: "txtOperator",
    },  
  },

};


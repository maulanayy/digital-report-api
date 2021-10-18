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
    txtParameterID: {
      type: "string",
      columnName: "txtParameterID",
    },
    intValueOperator: {
      type: "number",
      columnName: "intValueOperator",
    },  
    txtOperator: {
      type: "string",
      columnName: "txtOperator",
    },
    txtParameterOperator: {
      type: "string",
      columnName: "txtParameterOperator",
    },  
  },

};


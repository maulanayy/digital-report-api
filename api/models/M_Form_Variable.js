/**
 * M_Form_Variable.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intFormVariableID",
      autoIncrement: true,
    },
    txtVariableName: {
      type: "string",
      columnName: "txtVariableName",
    },
    intFormParameterID: {
      type: "number",
      columnName: "intFormParameterID",
    },
  },
};

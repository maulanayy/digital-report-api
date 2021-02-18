/**
 * M_Form_Variable_Value.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intFormValueVariableID",
      autoIncrement: true,
    },
    txtParameterVariableName: {
      type: "string",
      columnName: "txtParameterVariableName",
    },
    intFormVariableID: {
      type: "number",
      columnName: "intFormVariableID ",
    },
    txtVariableValue : {
      type : "string",
      columnName  : "txtVariableValue"
    },
  },
};

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
    intControlPointID : {
      type: "number",
      columnName: "intControlPointID",
    }
  },
};

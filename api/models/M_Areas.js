/**
 * M_Areas.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intAreaID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      required: true,
      columnName: "txtName",
    },
    intLabID : {
      type: "number",
      columnName: "intLabID",
    }
  },
};

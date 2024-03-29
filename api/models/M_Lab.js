/**
 * M_Lab.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intLabID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      required: true,
      unique: true,
      columnName: "txtName",
    },  
  },
};

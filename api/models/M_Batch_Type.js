/**
 * M_Batch_Type.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intBatchTypeID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      columnName: "txtName",
    },
  }
};


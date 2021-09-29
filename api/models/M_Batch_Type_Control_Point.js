/**
 * M_Batch_Type_Control_Point.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    id : {
      type :"number",
      columnName : "intBatchTypeControlPointID",
      autoIncrement : true,
    },
    intBatchTypeID: {
      type: "number",
      columnName: "intBatchTypeID",
    },
    intControlPointID: {
      type: "number",
      columnName: "intControlPointID",
    },

  },

};


/**
 * M_Type_OKP_CP.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intTypeOKPCPID",
      autoIncrement: true,
    },
    intTypeOKPID: {
      type: "number",
      columnName: "intTypeOKPID",
    },
    intControlPointID: {
      type: "number",
      columnName: "intControlPointID",
    },
  },
};


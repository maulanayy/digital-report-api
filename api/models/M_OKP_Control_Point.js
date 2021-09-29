/**
 * M_OKP_Control_Point.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id : {
      type :"number",
      columnName : "intOKPControlPointID",
      autoIncrement : true,
    },
    intOKPID: {
      type: "number",
      columnName: "intOKPID",
    },
    intControlPointID: {
      type: "number",
      columnName: "intControlPointID",
    },

  },

};


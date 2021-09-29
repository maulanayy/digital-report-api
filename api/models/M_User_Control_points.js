/**
 * M_User_Control_points.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id : {
      type :"number",
      columnName : "intUserControlPointID",
      autoIncrement : true,
    },
    intUserID: {
      type: "number",
      columnName: "intUserID",
    },
    intControlPointID: {
      type: "number",
      columnName: "intControlPointID",
    },
  },

};


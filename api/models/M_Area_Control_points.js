/**
 * M_Area_Control_points.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id : {
      type :"number",
      columnName : "intAreaControlPointID",
      autoIncrement : true,
    },
    intAreaID: {
      type: "number",
      columnName: "intAreaID",
    },
    intControlPointID: {
      type: "number",
      columnName: "intControlPointID",
    },

  },

};


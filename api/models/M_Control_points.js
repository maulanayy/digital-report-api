/**
 * M_Control_points.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intControlPointID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      required: true,
      unique: true,
      columnName: "txtName",
    },
    intLabID : {
      type: "number",
      columnName: "intLabID",
    }
  },
};

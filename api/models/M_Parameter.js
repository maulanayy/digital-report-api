/**
 * M_Parameter.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intParameterID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      columnName: "txtName",
    },
    intEwonSubsSettingID: {
      type: "number",
      columnName: "intEwonSubsSettingID",
    },
    intControlPointID : {
      type : "number",
      columnName : "intControlPointID"
    }
  },
};

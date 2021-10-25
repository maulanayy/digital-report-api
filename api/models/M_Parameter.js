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
    txtTestCode: {
      type: "string",
      columnName: "txtTestCode",
    },
    txtTipe: {
      type: "string",
      columnName: "txtTipe",
    },
    txtTipeData: {
      type: "string",
      columnName: "txtTipeData",
    },
    intEwonSubsSettingID: {
      type: "number",
      columnName: "intEwonSubsSettingID",
    },
  },
};

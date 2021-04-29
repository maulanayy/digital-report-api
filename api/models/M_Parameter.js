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
      unique: true,
      columnName: "txtName",
    },
    txtTipe: {
      type: "string",
      columnName: "txtTipe",
    },
    txtTipeData: {
      type: "string",
      enum: ["number", "text"],
      columnName: "txtTipeData",
    },
    // txtOracleParameter : {
    //   type : "string",
    //   columnName : "txtOracleParameter"
    // },
    txtStandardText : {
      type: "string",
      columnName: "txtStandardText",
    },
    IntStandarMin : {
      type: "number",
      columnName: "IntStandarMin",
    },
    IntStandarMax : {
      type: "number",
      columnName: "IntStandarMax",
    },
    intEwonSubsSettingID: {
      type: "number",
      columnName: "intEwonSubsSettingID",
    },
    intControlPointID : {
      type : "number",
      columnName : "intControlPointID"
    },
    txtFile : {
      type : "string",
      columnName : "txtFile", 
    }
  },
};

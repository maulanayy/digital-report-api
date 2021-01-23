/**
 * M_Ewon_subscriber.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intEwonSubsID",
      autoIncrement: true,
    },
    intEwonSubsSettingID: {
      type: "number",
      columnName: "intEwonSubsSettingID",
    },
    intValue: {
      type: "number",
      columnType: "float",
      columnName: "intValue",
    },
  },
};

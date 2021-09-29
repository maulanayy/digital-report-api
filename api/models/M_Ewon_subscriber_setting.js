/**
 * M_Ewon_subscriber_setting.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intEwonSubsSettingID",
      autoIncrement: true,
    },
    txtTopic: {
      type: "string",
      required: true,
      columnName: "txtTopic",
    },
    txtStatus: {
      type: "boolean",
      defaultsTo: true,
      columnName: "txtStatus",
    },
  },
};

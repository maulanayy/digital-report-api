/**
 * M_Work_shifts.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intWorkID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      columnName: "txtName",
    },
    dtmTimeStart: {
      type: "ref",
      columnType: "time",
      defaultsTo: null,
      columnName: "dtmTimeStart",
    },
    dtmTimeEnd: {
      type: "ref",
      columnType: "time",
      defaultsTo: null,
      columnName: "dtmTimeEnd",
    }
  },

};

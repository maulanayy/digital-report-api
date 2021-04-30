/**
 * M_Shift.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intShiftID",
      autoIncrement: true,
    },
    txtName: {
      type: "string",
      required: true,
      unique: true,
      columnName: "txtName",
    },
    dtmJadwal: {
      type: "ref",
      columnType: "date", 
      columnName: "dtmJadwal",
    },  
  },

};


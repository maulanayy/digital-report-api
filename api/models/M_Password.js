/**
 * M_Password.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intPassID",
      autoIncrement: true,
    },
    intHourSetting: {
      type: "number",
      columnName: "intHourSetting",
    },
  },

};


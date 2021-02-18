/**
 * M_Oracle.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id : {
      type : "number",
      columnName : "intOracleID",
      autoIncrement : true,
    },
    txtHost : {
      type : "string",
      columnName : "txtHost"
    },
    txtIP : {
      type : "string",
      columnName : "txtIP"
    },
    txtPassword : {
      type : "string",
      columnName : "txtPassword"
    },
  },

};


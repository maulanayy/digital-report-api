/**
 * M_Form_Input.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormInputID",
      autoIncrement: true,
    },
    txtRevision: {
      type: "string",
      columnName: "txtRevision",
    },
    dtmDateExpired: {
      type: "ref",
      columnType: "date",
      columnName: "dtmDateExpired",
    },
    txtProductDesc: {
      type: "string",
      columnName: "txtProductDesc",
    },
    dtmProductionDate: {
      type: "ref",
      columnType: "date",
      columnName: "dtmProductionDate",
    },
    txtPreparedBy : {
      type : "string",
      columnName : "txtPreparedBy"
    },
    txtApprovedBy : {
      type : "string",
      columnName : "txtApprovedBy"
    },
    intFormID : {
      type : "number",
      columnName : "intFormID"
    }
  },

};


/**
 * M_Form.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: "number",
      columnName: "intFormID",
      autoIncrement: true,
    },
   
    txtNoDok: {
      type: "string",
      required: true,
      columnName: "txtNoDok",
    },
    txtRevision: {
      type: "string",
      required: true,
      columnName: "txtRevision",
    },
    dtmDateExpired: {
      type: "ref",
      columnType: "date",
      columnName: "dtmDateExpired",
    },
    txtProductName: {
      type: "string",
      required: true,
      columnName: "txtProductName",
    },
    txtOKP: {
      type: "string",
      columnName: "txtOKP",
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
    txtRemark : {
      type : "string",
      columnName : "txtRemark"
    },
    intControlPointID : {
      type: "number",
      columnName: "intControlPointID",
    }
  },
};

/**
 * M_Form_Master_Value.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: "number",
      columnName: "intFormMasterValueID",
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
    txtApprove: {
      type: "boolean",
      defaultsTo: false,
      columnName: "txtApprove",
    },
    txtApprovedBy : {
      type : "string",
      columnName : "txtApprovedBy"
    },
    txtClosed: {
      type: "boolean",
      defaultsTo: false,
      columnName: "txtClosed",
    },
    intClosedBy : {
      type : "number",
      columnName: "intClosedBy"
    },
    intFormMasterID : {
      type: "number",
      columnName: "intFormMasterID",
    },
  },
};


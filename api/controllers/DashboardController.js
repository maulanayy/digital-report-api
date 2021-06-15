/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios');

const url = "http://localhost:3000"
module.exports = {

  getAll: async (req, res) => {
    try {
      const now = new Date();
      const month = now.getMonth()+1;
      const startDate = now.getFullYear() + "-" + month + "-01";
      const endDate = now.getFullYear() + "-" + month + "-30";
      const urlOKP = url + "/api/okp/result?start_date="+startDate+"&end_date="+endDate
      const dataOKP = await axios.get(urlOKP)

      sails.helpers.successResponse(dataOKP.data, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err.message);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getGroup: async (req, res) => {
    try {
      const now = new Date();
      const month = now.getMonth()+1;
      const startDate = now.getFullYear() + "-" + month + "-01";
      const endDate = now.getFullYear() + "-" + month + "-30";
     
      const urlOKP = url + "/api/okp/count-result?start_date="+startDate+"&end_date="+endDate
      const dataOKP = await axios.get(urlOKP)

      sails.helpers.successResponse(dataOKP.data, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err.message);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  }
};

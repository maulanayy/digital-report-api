/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require("axios");

const url = "http://localhost:3000";
module.exports = {
  getAll: async (req, res) => {
    const { page, limit } = req.query;
    try {
      const now = new Date();
      const OneWeekAgo = new Date();
      const OneWeekAgoDate = new Date(OneWeekAgo.setDate(OneWeekAgo.getDate() - 7)); 
      const startDate = OneWeekAgoDate.getFullYear() + "-" + (OneWeekAgoDate.getMonth() + 1) + "-" + OneWeekAgoDate.getDate(); 
      const endDate =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      const urlOKP = url + "/api/okp/result";
      const query = {
        start_date: startDate,
        end_date: endDate,
        offset: page,
        limit: limit,
      };
 
      let dataOKP = await axios.get(urlOKP, { params: query });

      const numberOfPages = Math.ceil(dataOKP.data.meta.TOTAL / limit);
      const nextPage = parseInt(page) + 1;
      const meta = {
        page: parseInt(page),
        perPage: limit,
        previousPage: parseInt(page) > 1 ? parseInt(page) - 1 : false,
        nextPage: numberOfPages >= nextPage ? nextPage : false,
        pageCount: numberOfPages,
        total: dataOKP.data.meta.TOTAL,
      };

      const data = {
        data: dataOKP.data.data,
        meta: meta,
      };
      sails.helpers.successResponse(data, "success").then((resp) => {
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
      const OneWeekAgo = new Date();
      const OneWeekAgoDate = new Date(OneWeekAgo.setDate(OneWeekAgo.getDate() - 7)); 
      const startDate = OneWeekAgoDate.getFullYear() + "-" + (OneWeekAgoDate.getMonth() + 1) + "-" + OneWeekAgoDate.getDate(); 
      const endDate =
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
      const query = {
        start_date: startDate,
        end_date: endDate,
      };
      const urlOKP = url + "/api/okp/count-result";
      const dataOKP = await axios.get(urlOKP, {
        params: query,
      });
      
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
};

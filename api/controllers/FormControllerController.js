/**
 * FormControllerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const M_Form = require("../models/M_Form");

module.exports = {
    getAll: async (req, res) => {
        const { page, limit } = req.query;
        let query = {
          dtmDeletedAt: null,
        };
        const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
        try {
          let forms = [];
          const pagination = {
            page: parseInt(page) - 1 || 0,
            limit: parseInt(limit) || 20,
          };
    
          const count = await M_Form.count(query);
          if (count > 0) {
            users = await M_Form.find(query)
              .skip(pagination.page * pagination.limit)
              .limit(pagination.limit)
              .sort(sort);
          }
    
          const numberOfPages = Math.ceil(count / pagination.limit);
          const nextPage = parseInt(page) + 1;
          const meta = {
            page: parseInt(page),
            perPage: pagination.limit,
            previousPage: parseInt(page) > 1 ? parseInt(page) - 1 : false,
            nextPage: numberOfPages >= nextPage ? nextPage : false,
            pageCount: numberOfPages,
            total: count,
          };
    
          const data = {
            data: forms,
            meta: meta,
          };
    
          sails.helpers.successResponse(data, "success").then((resp) => {
            res.ok(resp);
          });
        } catch (err) {
          console.log("ERROR : ", err);
          sails.helpers.errorResponse(err.message, "failed").then((resp) => {
            res.status(400).send(resp);
          });
        }
      },

};


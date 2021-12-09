/**
 * ParameterValueController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
  getParameter: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };        
    const sort = req.query.sort ? req.query.sort : "id ASC";
    try {
      let params = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Parameter_Value.count(query);
      if (count > 0) {
        params = await M_Parameter_Value.find(query)
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
        data: params,
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
  getDetailParameter: async (req, res) => {
    const { id } = req.params;
    try {
      let data = await M_Parameter_Value.findOne({
        where: {
          id: id,
        },
      });

      if (!data) {
        sails.helpers
          .errorResponse("parameter is empty", "failed")
          .then((resp) => {
            res.status(400).send(resp);
          });
      }

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
  createParameter: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {
      const params = body.map(x => {
        return {
          txtParameter : x.TEST_CODE,
          txtCustomValue : x.CUSTOM_VALUE
        }
      })

      const data = await M_Parameter_Value.createEach(params).fetch();
      
      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "create new custom parameter value"
      })

      sails.helpers.successResponse({}, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  updateParameter: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const parameter = await M_Parameter_Value.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!parameter) {
        sails.helpers
          .errorResponse("parameter data not found", "failed")
          .then((resp) => {
            res.status(400).send(resp);
          });
      }

      console.log(params)
      console.log('==========')
      console.log(body)

      const data = await M_Parameter_Value.update({
        id: params.id,
      }).set({
        txtParameter: body.parameter.toString(),
        txtCustomValue: body.custom_value,
        txtUpdatedBy: user.id,
        dtmUpdatedAt: new Date(),
      });

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "update custom parameter "+params.id
      })

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
  deleteParameter: async (req, res) => {
    const { user,params } = req;
    try {
        const parameter = await M_Parameter.findOne({
            where: {
              id: params.id,
              dtmDeletedAt: null,
            },
          });
    
          if (!parameter) {
            sails.helpers
              .errorResponse("parameter data not found", "failed")
              .then((resp) => {
                res.status(400).send(resp);
              });
          }
    
          const data = await M_Parameter_Value.update({
            id: params.id,
          }).set({
            dtmDeletedAt: new Date(),
          });
          
          await M_User_History.create({
            intUserID : user.id,
            txtAction : user.name + "delete custom parameter "+params.id
          })

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

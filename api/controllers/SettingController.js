/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const axios = require('axios');

 const url = "http://localhost:3000"

module.exports = {
  getEwon: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "id ASC";
    try {
      let ewondData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Ewon_subscriber_setting.count(query);
      if (count > 0) {
        ewondData = await M_Ewon_subscriber_setting.find(query)
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
        data: ewondData,
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
  getOneEwon: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await M_Ewon_subscriber_setting.findOne({
        where: {
          id: id,
          dtmDeletedAt: null,
        },
      });

      if (!data) {
        sails.helpers.errorResponse("data not found", "failed").then((resp) => {
          res.status(401).send(resp);
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
  getEwonCode: async (req, res) => {
    try {
      const topics = await M_Ewon_subscriber_setting.find({
        where: {
          dtmDeletedAt: null,
        },
        select: ["id", "txtTopic"],
      });

      const data = {
        data: topics,
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
  createEwon: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {
      const data = await M_Ewon_subscriber_setting.create({
        txtTopic: body.topic,
        txtCreatedBy: user.id,
        txtStatus: body.status,
      }).fetch();

      await M_User_History.create({
        intUserID: user.id,
        txtAction: user.name + "create new ewon",
      });

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
  updateEwon: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const ewon = await M_Ewon_subscriber_setting.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!ewon) {
        sails.helpers.errorResponse("ewon not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Ewon_subscriber_setting.update({
        id: params.id,
      }).set({
        txtTopic: body.topic,
        txtStatus: body.status,
        dtmUpdatedAt: new Date(),
      });

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
  deleteEwon: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const ewon = await M_Ewon_subscriber_setting.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!ewon) {
        sails.helpers.errorResponse("ewon not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Ewon_subscriber_setting.update({
        id: params.id,
      }).set({
        dtmDeletedAt: new Date(),
      });

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
  getOracle: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "id ASC";
    try {
      let oracleData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Oracle.count(query);
      if (count > 0) {
        oracleData = await M_Oracle.find(query)
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

      oracleData.map((oracle) => {
        oracle.txtIP = oracle.txtIP.replace(/[0-9]/g, "*");
        oracle.txtPassword = oracle.txtPassword.replace(/[A-Za-z]/g, "*");
        return oracle;
      });

      const data = {
        data: oracleData,
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
  getOneOracle: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await M_Oracle.findOne({
        where: {
          id: id,
          dtmDeletedAt: null,
        },
      });

      if (!data) {
        sails.helpers.errorResponse("data not found", "failed").then((resp) => {
          res.status(401).send(resp);
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
  createOracle: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {
      const data = await M_Oracle.create({
        txtHost: body.host,
        txtIP: body.ip,
        txtPassword: body.password,
      }).fetch();

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
  updateOracle: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const oracle = await M_Oracle.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!oracle) {
        sails.helpers
          .errorResponse("oracle data not found", "failed")
          .then((resp) => {
            res.status(401).send(resp);
          });
      }

      const data = await M_Oracle.update({
        id: params.id,
      }).set({
        txtHost: body.host,
        txtIP: body.ip,
        txtPassword: body.password,
        dtmUpdatedAt: new Date(),
      });

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
  deleteOracle: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const oracle = await M_Oracle.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!oracle) {
        sails.helpers
          .errorResponse("oracle data not found", "failed")
          .then((resp) => {
            res.status(401).send(resp);
          });
      }

      const data = await M_Oracle.update({
        id: params.id,
      }).set({
        dtmDeletedAt: new Date(),
      });

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
  getBatchTypeOracle : async (req,res) => {
    try{
      const urlBatch = url + "/api/batch-type"
      const dataBatch = await axios.get(urlBatch)
      sails.helpers.successResponse(dataBatch.data  , "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getBatchType: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };

    try {
      let okpData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Batch_Type.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
          SELECT m_batch_type.intBatchTypeID AS id, m_batch_type.txtName,GROUP_CONCAT(m_control_points.txtName )AS control_points FROM m_batch_type, m_batch_type_control_point, m_control_points 
WHERE m_batch_type.intBatchTypeID = m_batch_type_control_point.intBatchTypeID AND m_batch_type_control_point.intControlPointID = m_control_points.intControlPointID 
AND m_batch_type.dtmDeletedAt IS NULL GROUP BY m_batch_type.intBatchTypeID ORDER BY m_batch_type.intBatchTypeID ASC LIMIT $2 OFFSET $1
           `,
          [pagination.page * pagination.limit, pagination.limit]
        );

        okpData = queries.rows;
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
        data: okpData,
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
  getOneBatchType: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await M_Batch_Type.findOne({
        where: {
          id: id,
          dtmDeletedAt: null,
        },
      });

      if (!data) {
        sails.helpers.errorResponse("data not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }
      const queries = await sails.sendNativeQuery(
        `
        SELECT m_batch_type.intBatchTypeID AS id, m_batch_type.txtName,m_control_points.intControlPointID AS cp_id ,m_control_points.txtName AS control_points FROM m_batch_type, m_batch_type_control_point, m_control_points 
WHERE m_batch_type.intBatchTypeID = m_batch_type_control_point.intBatchTypeID AND m_batch_type_control_point.intControlPointID = m_control_points.intControlPointID 
AND m_batch_type.intBatchTypeID = $1 
        `,
        [id]
      );

      const batchType = queries.rows;

      const result = {
        data: batchType,
      };

      sails.helpers.successResponse(result, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  createBatchType: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {

      console.log(body)
      const batchType = await M_Batch_Type.create({
        txtName: body.name.value,
        txtCreatedBy: user.id,
      }).fetch();

      const controlPoints = body.cp.map((x) => {
        return {
          intBatchTypeID: batchType.id,
          intControlPointID: x,
          txtCreatedBy: user.id,
        };
      });

      await M_Batch_Type_Control_Point.createEach(controlPoints).fetch();

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
  updateBatchType: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const oracle = await M_Batch_Type.findOne({  
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!oracle) {
        sails.helpers
          .errorResponse("data not found", "failed")
          .then((resp) => {
            res.status(401).send(resp);
          });
      }

      const data = await M_Batch_Type.update({
        id: params.id,
      }).set({
        txtName: body.name,
      });

      const controlPoints = body.cp.map((x) => {
        return {
          intBatchTypeID: params.id,
          intControlPointID: x,
          txtCreatedBy: user.id,
        };
      });

      await M_Batch_Type_Control_Point.destroy({
        intBatchTypeID : params.id
      })

      await M_Batch_Type_Control_Point.createEach(controlPoints).fetch();

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
  deleteBatchType: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const batchType = await M_Batch_Type.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      console.l

      if (!batchType) {
        sails.helpers
          .errorResponse("batch type data not found", "failed")
          .then((resp) => {
            res.status(401).send(resp);
          });
      }

      const data = await M_Batch_Type.update({
        id: params.id,
      }).set({
        dtmDeletedAt: new Date(),
      });

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

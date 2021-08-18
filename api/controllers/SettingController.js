/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getEwon: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
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
        txtTypeTopic: body.type_topic,
        txtCreatedBy : user.id
      }).fetch();

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "create new ewon"
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
        txtTypeTopic: body.type_topic,
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
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
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

      oracleData.map(oracle => {
        oracle.txtIP = oracle.txtIP.replace(/[0-9]/g,"*")
        oracle.txtPassword = oracle.txtPassword.replace(/[A-Za-z]/g,"*")
        return oracle
      })

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
};

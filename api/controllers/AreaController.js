/**
 * AreaController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
    try {
      let areas = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Areas.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
          SELECT m_areas.intAreaID AS id,m_areas.txtName AS txtName, 
          m_lab.txtName AS labTxtName,m_areas.dtmCreatedAt AS dtmCreatedAt FROM m_areas,m_lab WHERE m_areas.dtmDeletedAt IS NULL 
          AND m_areas.intLabID = m_lab.intLabID ORDER BY m_areas.intAreaID ASC LIMIT $1 OFFSET $2
            `,
          [pagination.limit,pagination.page * pagination.limit]
        );
        areas = queries.rows;
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
        data: areas,
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
  getOne: async (req, res) => {
    const { id } = req.params;
    try {
      const queries = await sails.sendNativeQuery(
        `
        SELECT m_areas.intAreaID AS id,m_areas.txtName AS txtName, 
        m_lab.txtName AS labTxtName,m_areas.dtmCreatedAt AS dtmCreatedAt FROM m_areas,m_lab WHERE m_areas.dtmDeletedAt IS NULL 
        AND m_areas.intLabID = m_lab.intLabID AND m_areas.intAreaID = $1
          `,
        [id]
      );

      const data = queries.rows[0];

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
  getCode: async (req, res) => {
    try {
      const areas = await M_Areas.find({
        where: {
          dtmDeletedAt: null,
        },
        select: ["id", "txtName"],
      });

      const data = {
        data: areas,
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
  create: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {
      const data = await M_Areas.create({
        txtName: body.name,
        txtCreatedBy: user.id,
        intLabID: body.lab_id,
      }).fetch();

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "create new area"
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
  update: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    try {
      const area = await M_Areas.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!area) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Areas.update({
        id: params.id,
      }).set({
        txtName: body.name,
        txtUpdatedBy: user.id,
        dtmUpdatedAt: new Date(),
      });

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "update area " + params.id
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
  delete: async (req, res) => {
    const { user, params } = req;
    try {
      const area = await M_Areas.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!area) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Areas.update({
        id: params.id,
      }).set({
        txtDeletedBy: user.id,
        dtmDeletedAt: new Date(),
      });

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "delete area " + params.id
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

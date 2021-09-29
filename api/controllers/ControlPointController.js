/**
 * ControlPointController
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
      let controlPoints = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Control_points.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
          SELECT m_control_points.intControlPointID AS id,m_control_points.txtName AS txtName, m_area_control_points.intAreaID AS intAreaID
          ,GROUP_CONCAT(m_areas.txtName) AS txtAreaName,m_control_points.dtmCreatedAt AS dtmCreatedAt FROM m_areas,m_area_control_points,m_control_points WHERE m_control_points.dtmDeletedAt IS NULL 
          AND m_areas.intAreaID = m_area_control_points.intAreaID AND m_control_points.intControlPointID = m_area_control_points.intControlPointID GROUP BY m_control_points.intControlPointID ORDER BY m_control_points.intControlPointID ASC LIMIT $2 OFFSET $1
           `,
          [pagination.page * pagination.limit, pagination.limit]
        );

        controlPoints = queries.rows;
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
        data: controlPoints,
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
  getAllWithParameter: async (req, res) => {
    try {
      const queries = await sails.sendNativeQuery(
        `
        SELECT m_control_points.intControlPointID AS ID,m_control_points.txtName,COUNT(m_parameter.intParameterID)AS total_parameter FROM m_control_points,m_parameter 
        WHERE m_control_points.intControlPointID = m_parameter.intControlPointID GROUP BY m_control_points.intControlPointID `
      );
      const controlPoints = queries.rows;

      const data = {
        data: controlPoints,
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
        SELECT m_control_points.intControlPointID AS id,m_control_points.txtName AS txtName, m_area_control_points.intAreaID AS intAreaID
        ,m_areas.txtName AS txtAreaName,m_control_points.dtmCreatedAt AS dtmCreatedAt FROM m_areas,m_area_control_points,m_control_points WHERE m_control_points.dtmDeletedAt IS NULL 
        AND m_areas.intAreaID = m_area_control_points.intAreaID AND m_control_points.intControlPointID = m_area_control_points.intControlPointID AND m_control_points.dtmDeletedAt is NULL 
      AND m_control_points.intControlPointID = $1
        `,
        [id]
      );

      const areas = queries.rows;

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
  getCode: async (req, res) => {
    try {
      const controlPoints = await M_Control_points.find({
        where: {
          dtmDeletedAt: null,
        },
        select: ["id", "txtName"],
      });

      const data = {
        data: controlPoints,
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
      const controlPoint = await M_Control_points.create({
        txtName: body.name,
        txtCreatedBy: user.id,
      }).fetch();

      const areas = body.area_id.map((x) => {
        return {
          intControlPointID: controlPoint.id,
          intAreaID: x,
          txtCreatedBy: user.id,
        };
      });

      const data = await M_Area_Control_points.createEach(areas).fetch();

      await M_User_History.create({
        intUserID: user.id,
        txtAction: user.name + "create new control point",
      });

      sails.helpers.successResponse(controlPoint, "success").then((resp) => {
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
      const controlPoint = await M_Control_points.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!controlPoint) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const updateControlPoint = await M_Control_points.update({
        id: params.id,
      }).set({
        txtName: body.name,
        txtUpdatedBy: user.id,
        dtmUpdatedAt: new Date(),
      });

      await M_Area_Control_points.destroy({
        intControlPointID: params.id,
      });

      const areas = body.area_id.map((x) => {
        return {
          intControlPointID: params.id,
          intAreaID: x,
          txtCreatedBy: user.id,
        };
      });

      const data = await M_Area_Control_points.createEach(areas).fetch();

      await M_User_History.create({
        intUserID: user.id,
        txtAction: user.name + "update control point " + params.id,
      });

      sails.helpers
        .successResponse(updateControlPoint, "success")
        .then((resp) => {
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
      const controlPoint = await M_Control_points.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!controlPoint) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Control_points.update({
        id: params.id,
      }).set({
        txtDeletedBy: user.id,
        dtmDeletedAt: new Date(),
      });

      await M_Area_Control_points.update({
        intControlPointID: params.id,
      }).set({
        txtDeletedBy: user.id,
        dtmDeletedAt: new Date(),
      });

      await M_User_History.create({
        intUserID: user.id,
        txtAction: user.name + "delete control point " + params.id,
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

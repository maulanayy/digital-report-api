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
        // controlPoints = await M_Control_points.find(query)
        //   .skip(pagination.page * pagination.limit)
        //   .limit(pagination.limit)
        //   .sort(sort);

        const queries = await sails.sendNativeQuery(
          `
        SELECT m_control_points.intControlPointID as id,m_control_points.txtName as txtName, 
        m_areas.txtName as areaTxtName,m_control_points.dtmCreatedAt as dtmCreatedAt from m_areas,m_control_points where m_control_points.dtmDeletedAt is NULL 
        AND m_areas.intAreaID = m_control_points.intAreaID order by m_control_points.dtmCreatedAt DESC LIMIT $2 OFFSET $1
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
        select m_control_points."intControlPointID" as ID,m_control_points."txtName",count(m_parameter."intParameterID")as total_parameter from m_control_points,m_parameter 
        where m_control_points."intControlPointID" = m_parameter."intControlPointID" group by m_control_points."intControlPointID"
        `
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
      const data = await M_Control_points.findOne({
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
      const data = await M_Control_points.create({
        txtName: body.name,
        intAreaID: body.area_id,
        txtCreatedBy: user.id,
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

      const data = await M_Control_points.update({
        id: params.id,
      }).set({
        txtName: body.name,
        intAreaID: body.area_id,
        // txtUpdatedBy: user.id,
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

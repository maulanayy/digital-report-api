/**
 * PermissionController
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
      let permissions = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Permissions.count(query);
      if (count > 0) {
        permissions = await M_Permissions.find(query)
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
        data: permissions,
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
      const data = await M_Permissions.findOne({
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
  create: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {
      const data = await M_Permissions.create({
        txtName: body.name,
        txtCreatedBy: user.id,
      }).fetch();

      await M_Role_Permissions.create({
        intRoleID : body.role_id,
        intPermissionID : data.id,
        txtCreatedBy: user.id,
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
      const permission = await M_Permissions.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!permission) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Permissions.update({
        id: params.id,
      }).set({
        txtName: body.name,
        txtUpdatedBy: user.id,
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
      const permission = await M_Permissions.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!permission) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Permissions.update({
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

/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtData = {
  expiresIn: "1 day",
};

module.exports = {
  getAll: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
    try {
      let users = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Users.count(query);
      if (count > 0) {
        users = await M_Users.find(query)
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
        data: users,
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
      const data = await M_Users.findOne({
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
      const data = await M_Users.create({
        txtUsername: body.username,
        txtPassword: body.password,
        txtName: body.name,
        txtDepartment : body.department,
        txtRelationship : body.relationship,
        txtSex : body.sex,
        dtmBirtDate : body.birth_date,
        intAge : body.age,
        intRoleID: body.role_id,
        intLabID: body.lab_id,
        intControlPointID: body.control_point_id,
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
      const member = await M_Users.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!member) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Users.update({
        id: params.id,
      }).set({
        txtName: body.name,
        txtDepartment : body.department,
        txtRelationship : body.relationship,
        txtSex : body.sex,
        dtmBirtDate : body.birth_date,
        intAge : body.age,
        intRoleID: body.role_id,
        intLabID: body.lab_id,
        intControlPointID: body.control_point_id,
        txtUpdatedBy: user.id,
        updatedAt: new Date(),
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
      const member = await M_Users.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!member) {
        sails.helpers.errorResponse("user not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Users.update({
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
  login: async (req, res) => {
    const { body } = req;
    try {
      console.log(body);
      let user = await M_Users.findOne({
        where: { txtUsername: body.username },
        select: ["id", "txtName", "txtUsername", "txtPassword"],
      });
      if (!user) {
        sails.helpers
          .errorResponse(err.message, "user not found")
          .then((resp) => {
            res.status(400).send(resp);
          });
      } else {
        const userData = {
          id: user.id,
          name: user.txtName,
          username: user.txtUsername,
        };

        bcrypt.compare(body.password, user.txtPassword, (err, valid) => {
          console.log(valid);
          if (valid) {
            userData.token = jwt.sign(
              userData,
              sails.config.session.secret,
              jwtData
            );

            sails.helpers.successResponse(userData, "success").then((resp) => {
              res.ok(resp);
            });
          } else {
            sails.helpers
              .errorResponse("Email or Password Wrong...", "failed")
              .then((resp) => {
                res.status(400).send(resp);
              });
          }
        });
      }
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
};

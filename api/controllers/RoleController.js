/**
 * RoleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAll: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmdDletedAt: {
        "!=": null,
      },
    };
    const sort = req.query.sort ? req.query.sort : "createdAt DESC";
    try {
      let roles = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      const count = await M_Roles.count(query);
      if (count > 0) {
        roles = await M_Roles.find(query)
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
        data: roles,
        meta: meta,
      };
      const resp = await sails.helpers.successResponse(data, "success");
      res.ok(resp);
    } catch (err) {
      console.log("ERROR : ", err);
      const resp = await sails.helpers.errorResponse(err.message, "failed");
      res.status(401).send(resp);
    }
  },
};

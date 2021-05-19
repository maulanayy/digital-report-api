/**
 * ParameterController
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
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
    try {
      let parameterData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };
      const count = await M_Parameter.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
              SELECT m_parameter.intParameterID AS id,m_parameter.txtName AS txtName,m_parameter.txtTipe AS txtTipe
              ,IF (m_parameter.txtTipe = 'mesin',(SELECT txtTopic FROM m_ewon_subscriber_setting WHERE intEwonSubsSettingID = m_parameter.intEwonSubsSettingID),'-') AS txtTopic,m_control_points.txtName AS ControlPointTxtName,
              m_parameter.dtmCreatedAt FROM m_parameter,m_control_points WHERE m_parameter.intControlPointID = m_control_points.intControlPointID AND m_parameter.dtmDeletedAt IS NULL ORDER BY m_parameter.dtmCreatedAt DESC LIMIT $2 OFFSET $1
                `,
          [pagination.page * pagination.limit, pagination.limit]
        );
        parameterData = queries.rows;
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
        data: parameterData,
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
  getOneParameter: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await M_Parameter.findOne({
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
  getParameterByCP: async (req, res) => {
    const { cp_id } = req.params;
    try {
      // const queries = await sails.sendNativeQuery(
      //   `
      //   select m_parameter.intParameterID as ID, m_parameter.txtName as parameter_name,m_parameter.intEwonSubsSettingID as ewon_id,max(m_ewon_subscriber.intValue) as value from m_parameter,m_ewon_subscriber
      //   where m_parameter.intControlPointID = $1 and m_parameter.intEwonSubsSettingID = m_ewon_subscriber.intEwonSubsSettingID group by m_parameter.intParameterID
      //   `,
      //   [cp_id]
      // );

      const queries = await sails.sendNativeQuery(
        `
            SELECT m_parameter.intParameterID AS ID, m_parameter.txtName AS parameter_name,m_parameter.intEwonSubsSettingID AS ewon_id FROM m_parameter
            WHERE m_parameter.intControlPointID = $1  GROUP BY m_parameter.intParameterID
            `,
        [cp_id]
      );

      const params = queries.rows;

      await Promise.all(
        params.map(async (x) => {
          const rawValue = await sails.sendNativeQuery(
            `
              SELECT IFNULL((SELECT MAX(intValue) FROM m_ewon_subscriber WHERE intEwonSubsSettingID = $1), 0) AS value
              `,
            [cp_id]
          );

          x.value = rawValue.rows[0].value;

          return x;
        })
      );

      const data = {
        data: params,
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
  createParameter: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {

      const data = await M_Parameter.create({
        txtName: body.name,
        txtTipe: body.tipe,
        txtTipeData: body.tipe_data,
        txtStandardText: body.txtStandard,
        IntStandarMin: body.numStandarMin,
        IntStandarMax: body.numStandarMax,
        intEwonSubsSettingID: body.topic_id,
        txtCreatedBy: user.id,
        intControlPointID: body.cp_id,
      }).fetch();

      if (body.tipe == "formula") {
        let formulas = [];

        for (let x = 0; x < body.formula.length; x++) {
          const element = body.formula[x];
          console.log(element)
          const operator = element.operator == "" ? " " : element.operator
          formulas.push({
              intParameterID : data.id,
              intParameterFormulaID : element.parameter,
              txtOperator : operator
          })
        }

        const dataFormula = await M_Formula.createEach(formulas).fetch()

        console.log(dataFormula)
      }

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "create new parameter"
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
  updateParameter: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
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
            res.status(401).send(resp);
          });
      }

      const data = await M_Parameter.update({
        id: params.id,
      }).set({
        txtName: body.name,
        txtTipe: body.tipe,
        txtTipeData: body.tipe_data,
        txtStandardText: body.txtStandard,
        IntStandarMin: body.numStandarMin,
        IntStandarMax: body.numStandarMax,
        intEwonSubsSettingID: body.topic_id,
        intControlPointID: body.cp_id,
        txtUpdatedBy: user.id,
        dtmUpdatedAt: new Date(),
      });

      if (body.tipe == "formula") {
        let formulas = [];

        await M_Formula.destroy({
          intParameterID : id
        })
        
        for (let x = 0; x < body.formula.length; x++) {
          const element = body.formula[x];
          console.log(element)
          const operator = element.operator == "" ? " " : element.operator
          formulas.push({
              intParameterID : params.id,
              intParameterFormulaID : element.parameter,
              txtOperator : operator
          })
        }

        const dataFormula = await M_Formula.createEach(formulas).fetch()

        console.log(dataFormula)
      }

      await M_User_History.create({
        intUserID : user.id,
        txtAction : user.name + "update parameter "+params.id
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
                res.status(401).send(resp);
              });
          }
    
          const data = await M_Parameter.update({
            id: params.id,
          }).set({
            dtmDeletedAt: new Date(),
          });
          
          if(params.txtTipe == "formula"){
            await M_Formula.update({
                intParameterID: params.id,
              }).set({
                txtDeletedBy: user.id,
                dtmDeletedAt: new Date(),
              });
          }

          await M_User_History.create({
            intUserID : user.id,
            txtAction : user.name + "delete lab "+params.id
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

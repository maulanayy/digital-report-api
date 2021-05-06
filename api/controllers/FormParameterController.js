/**
 * FormParameterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getFormSetting: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
    try {
      let formData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };
      const count = await M_Form.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
          SELECT m_form.intFormID as id,m_form.txtFormName,m_form.txtNoDok,m_product.txtName AS txtNameProduct,m_form.txtOkp,m_control_points.txtName AS txtNameCP,m_form.dtmCreatedAt AS dtmCreatedAt FROM m_form,m_product,m_control_points WHERE m_form.intControlPointID = m_control_points.intControlPointID AND 
          m_product.intProductID = m_form.txtProductName AND m_form.dtmDeletedAt IS NULL ORDER BY m_form.dtmCreatedAt DESC LIMIT $2 OFFSET $1
                `,
          [pagination.page * pagination.limit, pagination.limit]
        );
        formData = queries.rows;
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
        data: formData,
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
  getFormData: async (req, res) => {
    const { page, limit } = req.query;
    let query = {
      dtmDeletedAt: null,
    };
    const sort = req.query.sort ? req.query.sort : "dtmCreatedAt DESC";
    try {
      let formData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };
      const count = await M_Form.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
          SELECT m_form.intFormID as id,m_form.txtFormName,m_form.txtNoDok,m_product.txtName AS txtNameProduct,m_form.txtOkp,m_control_points.txtName AS txtNameCP,m_form_input.dtmCreatedAt AS dtmCreatedAt,m_form_input.dtmProductionDate as dtmProductionDate,m_form_input.txtApprovedBy FROM m_form,m_product,m_control_points,m_form_input 
          WHERE m_form.intControlPointID = m_control_points.intControlPointID AND m_form_input.intFormID = m_form.intFormID AND
          m_product.intProductID = m_form.txtProductName AND m_form.dtmDeletedAt IS NULL ORDER BY m_form_input.dtmCreatedAt DESC LIMIT $2 OFFSET $1
                `,
          [pagination.page * pagination.limit, pagination.limit]
        );
        formData = queries.rows;
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
        data: formData,
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
  getOneFormData: async (req, res) => {
    const { params } = req;
    console.log(params);
    try {
      const data = await M_Form_Input.findOne({
        where: {
          dtmDeletedAt: null,
          id: params.id,
        },
      });

      if (!data) {
        sails.helpers.errorResponse("data not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const queries = await sails.sendNativeQuery(
        `
        SELECT m_form_input.intFormInputID as id ,m_form.intFormID AS intFormID,m_form.txtFormName,m_form.txtNoDok,m_product.txtName AS txtNameProduct,m_form.txtOkp,m_form_input.dtmProductionDate AS dtmProductionDate,
        m_form_input.dtmDateExpired AS dtmDateExpired,m_form_input.txtApprovedBy,m_form_input.txtProductDesc AS txtProductDesc FROM m_form,m_product,m_form_input
        WHERE  m_form_input.intFormID = m_form.intFormID AND m_product.intProductID = m_form.txtProductName AND m_form.dtmDeletedAt IS NULL AND m_form_input.intFormInputID = $1
                `,
        [data.id]
      );
      let formData = queries.rows[0];

      const variable = await M_Form_Variable_Value.find({
        where: {
          intFormVariableID: params.id,
          dtmDeletedAt: null,
        },
        select: ["id", "txtParameterVariableName", "intFormVariableID","txtVariableValue"],
      });

      formData["variable"] = variable;

      const queriesParameter = await sails.sendNativeQuery(
        `
        SELECT m_form_parameter.intParameterID, m_form_parameter.txtParameterName,m_parameter.txtTipe 
        FROM m_form_parameter,m_parameter WHERE m_form_parameter.intParameterID = m_parameter.intParameterID
        AND m_form_parameter.intFormID = $1
        `,
        [data.intFormID]
      );

      const listParameter = queriesParameter.rows;

      formData["parameter"] = listParameter;

      sails.helpers.successResponse(formData, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getFormSettingCode: async (req, res) => {
    try {
      const forms = await M_Form.find({
        where: {
          dtmDeletedAt: null,
        },
        select: ["id", "txtFormName"],
      });

      const data = {
        data: forms,
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
  getOneFormSetting: async (req, res) => {
    const { id } = req.params;
    try {
      const queriesForm = await sails.sendNativeQuery(
        `
          SELECT m_form.intFormID as id,m_form.txtNoDok,m_form.txtOKP,m_product.txtName 
          FROM m_form,m_product where m_form.txtProductName = m_product.intProductID
          AND m_form.intFormID = $1
        `,
        [id]
      );

      const data = queriesForm.rows[0];

      if (!data) {
        sails.helpers.errorResponse("data not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const variable = await M_Form_Variable.findOne({
        where: {
          intFormParameterID: id,
          dtmDeletedAt: null,
        },
        select: ["id", "txtVariableName", "intFormParameterID"],
      });

      data["variable"] = variable;

      const queries = await sails.sendNativeQuery(
        `
        SELECT m_form_parameter.intParameterID, m_form_parameter.txtParameterName,m_parameter.txtTipe 
        FROM m_form_parameter,m_parameter WHERE m_form_parameter.intParameterID = m_parameter.intParameterID
        AND m_form_parameter.intFormID = $1
        `,
        [id]
      );

      const listParameter = queries.rows;

      data["parameter"] = listParameter;

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
  getParameterForm: async (req, res) => {
    const { id } = req.params;
    try {
      const queries = await sails.sendNativeQuery(
        `
        SELECT m_form_parameter.intParameterID, m_form_parameter.txtParameterName,m_parameter.txtTipe 
        FROM m_form_parameter,m_parameter WHERE m_form_parameter.intParameterID = m_parameter.intParameterID
        `
      );

      const data = {
        data: queries.rows,
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
  createFormSetting: async (req, res) => {
    const { user } = req;
    let { body } = req;
    let parameters = [];
    try {
      console.log(body);
      const form = await M_Form.create({
        txtFormName: body.name,
        txtNoDok: body.no_doc,
        txtOKP: body.okp,
        txtProductName: body.product,
        txtRemark: body.remark,
        intControlPointID: body.cp_id,
      }).fetch();

      const variable = await M_Form_Variable.create({
        txtVariableName: body.variable,
        intFormParameterID: form.id,
      }).fetch();

      for (let x = 0; x < body.dataParameter.length; x++) {
        const element = body.dataParameter[x];

        parameters.push({
          intParameterID: element.parameterID,
          txtParameterName: element.parameter,
          intFormID: form.id,
        });
      }

      await M_Form_Parameter.createEach(parameters).fetch();
      sails.helpers.successResponse(form, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },

  createFormData: async (req, res) => {
    const { user } = req;
    let { body } = req;
    let parameterValue = [];
    let variableValue = [];
    try {
      const form = await M_Form_Input.create({
        intFormID: body.form,
        txtRevision: "-",
        dtmDateExpired: body.expired_date,
        txtProductDesc: body.product_desc,
        dtmProductionDate: body.product_date,
        txtPreparedBy: "",
        txtApprovedBy: "",
      }).fetch();


      for (let x = 0; x < body.parameter_value.length; x++) {
        const element = body.parameter_value[x];
        const keys = Object.keys(element);
        variableValue.push({
          txtParameterVariableName: keys[0],
          intFormVariableID:element[keys[0]].id,
          intFormInputID: form.id,
          txtVariableValue: element[keys[0]].value,
        });

        for (let index = 1; index < keys.length-1; index++) {
          const param = keys[index];
          parameterValue.push({
            txtParameterName : param,
            intFormInputID : form.id,
            intFormParameterID : element[param].id,
            txtParameterValue : element[param].value
          })
        }
      }

      await M_Form_Variable_Value.createEach(variableValue).fetch();

      await M_Form_Parameter_Value.createEach(parameterValue).fetch();
      sails.helpers.successResponse(form, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  updateFormData: async (req, res) => {
    const { user } = req;
    let { body, params } = req;
    try {
      const form = await M_Form_Input.create({
        intFormID: body.form,
        txtRevision: "-",
        dtmDateExpired: body.expired_date,
        txtProductDesc: body.product_desc,
        dtmProductionDate: body.product_date,
        txtPreparedBy: "",
        txtApprovedBy: "",
      }).fetch();

      sails.helpers.successResponse(form, "success").then((resp) => {
        res.ok(resp);
      });
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  createFormVariableSetting: async (req, res) => {
    const { user } = req;
    let { body } = req;
    try {
      const data = await M_Parameter.create({
        txtName: body.name,
        txtTipe: body.tipe,
        intEwonSubsSettingID: body.topic_ip,
        intControlPointID: body.cp_id,
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
  updateFormSetting: async (req, res) => {
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
        dtmUpdatedAt: new Date(),
      });

      if (body.tipe == "formula") {
        let formulas = [];

        await M_Formula.destroy({
          intParameterID: id,
        });

        for (let x = 0; x < body.formula.length; x++) {
          const element = body.formula[x];
          console.log(element);
          const operator = element.operator == "" ? " " : element.operator;
          formulas.push({
            intParameterID: params.id,
            intParameterFormulaID: element.parameter,
            txtOperator: operator,
          });
        }

        const dataFormula = await M_Formula.createEach(formulas).fetch();

        console.log(dataFormula);
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
  deleteFormSetting: async (req, res) => {
    const { params } = req;
    let { body } = req;
    try {
      const parameter = await M_Form.findOne({
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

      const data = await M_Form.update({
        id: params.id,
      }).set({
        dtmDeletedAt: new Date(),
      });

      await M_Form_Variable.update({
        intFormParameterID: params.id,
      }).set({
        dtmDeletedAt: new Date(),
      });

      await M_Form_Parameter.update({
        intFormID: params.id,
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

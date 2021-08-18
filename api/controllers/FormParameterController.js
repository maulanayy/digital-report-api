/**
 * FormParameterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Excel = require('exceljs')

module.exports = {
  getFormSetting: async (req, res) => {
    const {
      page,
      limit
    } = req.query;
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
          SELECT m_form.intFormID AS id,m_form.txtFormName,m_form.txtNoDok,m_form.txtProductName,m_form.txtOkp,m_control_points.txtName AS txtNameCP,m_form.dtmCreatedAt AS dtmCreatedAt FROM 
          m_form,m_control_points WHERE m_form.intControlPointID = m_control_points.intControlPointID AND m_form.dtmDeletedAt IS NULL ORDER BY m_form.dtmCreatedAt DESC LIMIT $2 OFFSET $1
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
    const {
      page,
      limit
    } = req.query;

    try {
      let formData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      let params = [pagination.page * pagination.limit, pagination.limit];

      let q = `
        SELECT m_form_input.intFormInputID AS id,m_form.txtFormName,m_form.txtNoDok,m_form.txtProductName AS txtNameProduct,m_form.txtOkp,m_control_points.txtName AS txtNameCP,m_form_input.dtmCreatedAt AS dtmCreatedAt,m_form_input.dtmProductionDate AS dtmProductionDate,m_form_input.txtApprovedBy,m_form_input.txtClosed,m_form_input.txtApprove 
        FROM m_form,m_control_points,m_form_input WHERE m_form.intControlPointID = m_control_points.intControlPointID AND m_form_input.intFormID = m_form.intFormID AND
        m_form.dtmDeletedAt IS NULL 
              `;

      if (req.query.date_start) {
        console.log("DATE START : ", req.query.date_start);
        q += `AND m_form_input.dtmCreatedAt >= $` + (params.length + 1) + ` `;
        params.push(req.query.date_start);
      }

      if (req.query.date_end) {
        console.log("DATE END : ", req.query.date_end);
        q += `AND m_form_input.dtmCreatedAt <= $` + (params.length + 1) + ` `;
        params.push(req.query.date_end);
      }

      if (req.query.product_name) {
        console.log("PRODUCT NAME : ", req.query.product_name);
        q += `AND m_form.txtProductName = $` + (params.length + 1) + ` `;
        params.push(req.query.product_name);
      }

      if (req.query.no_document) {
        console.log("NO DOCUMENT : ", req.query.no_document);
        q += `AND m_form.txtNoDok = $` + (params.length + 1) + ` `;
        params.push(req.query.no_document);
      }

      q += `ORDER BY m_form_input.dtmCreatedAt DESC LIMIT $2 OFFSET $1`;

      console.log(q);
      const queries = await sails.sendNativeQuery(q, params);
      formData = queries.rows;

      const numberOfPages = Math.ceil(formData.length / pagination.limit);
      const nextPage = parseInt(page) + 1;
      const meta = {
        page: parseInt(page),
        perPage: pagination.limit,
        previousPage: parseInt(page) > 1 ? parseInt(page) - 1 : false,
        nextPage: numberOfPages >= nextPage ? nextPage : false,
        pageCount: numberOfPages,
        total: formData.length,
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
    const {
      params
    } = req;
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

      let q = `
      SELECT m_form_input.intFormInputID AS id ,m_form.intFormID AS intFormID,m_form.txtFormName,m_form.txtNoDok,m_form.txtProductName AS txtNameProduct,m_form.txtOkp,m_form_input.dtmProductionDate AS dtmProductionDate,
      m_form_input.dtmDateExpired AS dtmDateExpired,m_form_input.txtApprovedBy,m_form_input.txtProductDesc AS txtProductDesc FROM m_form,m_form_input
      WHERE m_form_input.intFormID = m_form.intFormID AND m_form.dtmDeletedAt IS NULL AND m_form_input.intFormInputID = $1
              `;

      console.log("FORM INPUT ID : ", params.id)
      const queries = await sails.sendNativeQuery(q, [data.id]);
      let formData = queries.rows[0];
      const variable = await M_Form_Variable_Value.find({
        where: {
          intFormInputID: params.id,
          dtmDeletedAt: null,
        },
        select: [
          "id",
          "txtParameterVariableName",
          "txtVariableValue",
        ],
      });
      formData["variable"] = variable;

      const parameters = await M_Form_Parameter_Value.find({
        where: {
          intFormInputID: params.id
        },
        select: [
          "id",
          "txtParameterName",
          "txtParameterValue",
        ]
      })
      // const queriesParameter = await sails.sendNativeQuery(
      //   `
      //     SELECT m_form_parameter.intParameterID, m_form_parameter.txtParameterName,m_parameter.txtTipe 
      //     FROM m_form_parameter,m_parameter WHERE m_form_parameter.intParameterID = m_parameter.intParameterID
      //     AND m_form_parameter.intFormID = $1
      //   `,
      //   [data.intFormID]
      // );

      // const listParameter = queriesParameter.rows;

      formData["parameter"] = parameters;

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
    const {
      id
    } = req.params;
    try {
      const data = await M_Form.findOne({
        where: {
          id: id,
        },
      });

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
        select: ["id", "txtVariableName"],
      });

      data["variable"] = variable;

      let listParameter = await M_Form_Parameter.find({
        where: {
          intFormID: id,
        },
        select: [
          "intParameterID",
          "txtParameterName",
          "intMinValue",
          "intMaxValue",
        ],
      });

      listParameter = listParameter.map((x) => {
        x["txtTipe"] = "manual";
        return x;
      });
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
    const {
      id
    } = req.params;
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
    const {
      user
    } = req;
    let {
      body
    } = req;
    let parameters = [];
    try {
      const form = await M_Form.create({
        txtFormName: body.name,
        txtNoDok: body.no_doc,
        txtLotNumber: body.lot_number,
        txtOKP: body.okp,
        txtProductName: body.product,
        txtRemark: body.remark,
        intControlPointID: body.cp_id,
      }).fetch();

      await M_Form_Variable.create({
        txtVariableName: body.variable,
        intFormParameterID: form.id,
      }).fetch();

      for (let x = 0; x < body.dataParameter.length; x++) {
        const element = body.dataParameter[x];
        const minValue =
          element.MIN_VALUE != null && element.MIN_VALUE != "" ?
          element.MIN_VALUE :
          0;
        const maxValue =
          element.MAX_VALUE != null && element.MIN_VALUE != "" ?
          element.MAX_VALUE :
          0;
        parameters.push({
          intParameterID: element.TEST_CODE,
          txtParameterName: element.TEST_DESC,
          intMinValue: minValue,
          intMaxValue: maxValue,
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
    const {
      user
    } = req;
    let {
      body
    } = req;
    let parameterValue = [];
    let variableValue = [];
    try {
      const form = await M_Form_Input.create({
        intFormID: body.form,
        txtRevision: "-",
        dtmDateExpired: body.expired_date,
        txtProductDesc: body.product_desc,
        dtmProductionDate: body.product_date,
        txtPreparedBy: user.id,
        txtApprovedBy: "",
        txtClosed: false,
        txtApprove: false,
      }).fetch();

      const variable = await M_Form_Variable.findOne({
        where: {
          intFormParameterID: body.form,
          dtmDeletedAt: null,
        },
        select: ["id", "txtVariableName", "intFormParameterID"],
      });

      const params = await M_Form_Parameter.find({
        where: {
          intFormID: body.form,
          dtmDeletedAt: null,
        },
        select: ["id", "txtParameterName"],
      });

      for (let x = 0; x < body.parameters.length; x++) {
        const element = body.parameters[x];
        // const keys = Object.keys(element);
        variableValue.push({
          txtParameterVariableName: variable.txtVariableName,
          intFormVariableID: variable.id,
          intFormInputID: form.id,
          txtVariableValue: element["value_variable"],
        });

        const param = params.filter((x) => {
          return x.txtVariableName == element["parameter"];
        });

        parameterValue.push({
          txtParameterName: element["parameter"],
          intFormInputID: form.id,
          intFormParameterID: param.id,
          txtFormVaraibleValue: element["value_variable"],
          txtParameterValue: element["value_parameter"],
        });
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
    const {
      user
    } = req;
    let {
      body,
      params
    } = req;
    let parameterValue = [];
    let variableValue = [];
    try {
      const variable = await M_Form_Variable.findOne({
        where: {
          intFormParameterID: body.form,
          dtmDeletedAt: null,
        },
        select: ["id", "txtVariableName", "intFormParameterID"],
      });

      const paramsForm = await M_Form_Parameter.find({
        where: {
          intFormID: body.form,
          dtmDeletedAt: null,
        },
        select: ["id", "txtParameterName"],
      });

      for (let x = 0; x < body.parameters.length; x++) {
        const element = body.parameters[x];
        console.log(element)
        variableValue.push({
          txtParameterVariableName: element.variable,
          intFormVariableID: variable.id,
          intFormInputID: params.id,
          txtVariableValue: element["value_variable"],
        });

        const param = paramsForm.filter((x) => {
          return x.txtVariableName == element["parameter"];
        });

        parameterValue.push({
          txtParameterName: element["parameter"],
          intFormInputID: params.id,
          intFormParameterID: param.id,
          txtFormVaraibleValue: element["value_variable"],
          txtParameterValue: element["value_parameter"],
        });
      }

      await M_Form_Variable_Value.createEach(variableValue).fetch();
      await M_Form_Parameter_Value.createEach(parameterValue).fetch();

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
  createFormVariableSetting: async (req, res) => {
    const {
      user
    } = req;
    let {
      body
    } = req;
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
    const {
      user,
      params
    } = req;
    let {
      body
    } = req;
    try {
      const form = await M_Form.findOne({
        where: {
          id: params.id,
          dtmDeletedAt: null,
        },
      });

      if (!form) {
        sails.helpers
          .errorResponse("form data not found", "failed")
          .then((resp) => {
            res.status(401).send(resp);
          });
      }

      const variable = await M_Form_Variable.update({
        intFormParameterID: id,
      }).set({
        txtVariableName: body.variable,
      });

      await M_Form_Parameter.destroy({
        intFormID: params.id,
      }).fetch();

      for (let x = 0; x < body.dataParameter.length; x++) {
        const element = body.dataParameter[x];
        const minValue = element.MIN_VALUE != null ? element.MIN_VALUE : 0;
        const maxValue = element.MAX_VALUE != null ? element.MAX_VALUE : 0;
        parameters.push({
          intParameterID: element.TEST_CODE,
          txtParameterName: element.TEST_DESC,
          intMinValue: minValue,
          intMaxValue: maxValue,
          intFormID: form.id,
        });
      }

      await M_Form_Parameter.createEach(parameters).fetch();

      // const data = await M_Parameter.update({
      //   id: params.id,
      // }).set({
      //   txtName: body.name,
      //   txtTipe: body.tipe,
      //   txtTipeData: body.tipe_data,
      //   txtStandardText: body.txtStandard,
      //   IntStandarMin: body.numStandarMin,
      //   IntStandarMax: body.numStandarMax,
      //   intEwonSubsSettingID: body.topic_id,
      //   intControlPointID: body.cp_id,
      //   dtmUpdatedAt: new Date(),
      // });

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
    const {
      params
    } = req;
    let {
      body
    } = req;
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
  approveFormData: async (req, res) => {
    const {
      params,
      user
    } = req;
    try {
      const data = await M_Form_Input.update({
        id: params.id,
      }).set({
        txtApprove: true,
        txtClosed: true,
        intApproveBy: user.id,
        intClosedBy: user.id,
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
  closeFormData: async (req, res) => {
    const {
      params,
      user
    } = req;
    try {
      const data = await M_Form_Input.update({
        id: params.id,
      }).set({
        txtClosed: true,
        intClosedBy: user.id,
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
  FormPrint: async (req, res) => {
    const {
      params
    } = req;
    try{
    let workbook = new Excel.Workbook()
    const worksheet = workbook.addWorksheet('My Sheet');

    const form = await M_Form_Input.findOne({
      where: {
        dtmDeletedAt: null,
        id: params.id,
      },
    });

    const parameters = await M_Form_Parameter_Value.find({
      where: {
        intFormInputID: params.id
      }
    })

    worksheet.columns = [{
        header: 'First Name',
        key: 'firstName'
      },
      {
        header: 'Last Name',
        key: 'lastName'
      },
      {
        header: 'Purchase Price',
        key: 'purchasePrice'
      },
      {
        header: 'Payments Made',
        key: 'paymentsMade'
      },
      {
        header: 'Amount Remaining',
        key: 'amountRemaining'
      },
      {
        header: '% Remaining',
        key: 'percentRemaining'
      }
    ]

    worksheet.insertRow(1, {
      firstName: 'maulana',
      lastName: 'yusuf',
      purchasePrice: '12',
      paymentsMade: 2,
      amountRemaining: 3,
      percentRemaining: 100
    })
    workbook.xlsx.writeFile('Report.xlsx')

    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Report.xlsx"
    );

    res.end();
  } catch (err) {
    console.log("ERROR : ", err);
    sails.helpers.errorResponse(err.message, "failed").then((resp) => {
      res.status(400).send(resp);
    });
  }
},
};

/**
 * FormParameterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const Excel = require("exceljs");
const fs = require("fs");

module.exports = {
  getFormData: async (req, res) => {
    const { page, limit } = req.query;

    try {
      let formData = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };

      let params = [pagination.page * pagination.limit, pagination.limit];

      let q = `
      SELECT m_form_master_value.intFormMasterValueID AS id,m_form_master.txtFormName,m_form_master.txtNoDok,m_form_master_value.txtProductDesc AS txtNameProduct,m_form_master_value.txtOKP,m_form_master_value.dtmCreatedAt AS dtmCreatedAt,m_form_master_value.dtmProductionDate AS dtmProductionDate,m_form_master_value.txtApprovedBy,
      m_form_master_value.txtClosed,m_form_master_value.txtApprove FROM m_form_master,m_form_master_value WHERE m_form_master.intFormMasterID = m_form_master_value.intFormMasterID AND m_form_master_value.dtmDeletedAt IS NULL 
              `;

      if (req.query.date_start) {
        console.log("DATE START : ", req.query.date_start);
        q +=
          `AND m_form_master_value.dtmCreatedAt >= $` +
          (params.length + 1) +
          ` `;
        params.push(req.query.date_start);
      }

      if (req.query.date_end) {
        console.log("DATE END : ", req.query.date_end);
        q +=
          `AND m_form_master_value.dtmCreatedAt <= $` +
          (params.length + 1) +
          ` `;
        params.push(req.query.date_end);
      }

      if (req.query.product_name) {
        console.log("PRODUCT NAME : ", req.query.product_name);
        q +=
          `AND m_form_master_value.txtProductName = $` +
          (params.length + 1) +
          ` `;
        params.push(req.query.product_name);
      }

      if (req.query.no_document) {
        console.log("NO DOCUMENT : ", req.query.no_document);
        q += `AND m_form.txtNoDok = $` + (params.length + 1) + ` `;
        params.push(req.query.no_document);
      }

      q += `ORDER BY m_form_master_value.dtmCreatedAt DESC LIMIT $2 OFFSET $1`;

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
    const { params } = req;
    try {
      const data = await M_Form_Master_Value.findOne({
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
      SELECT m_form_master_value.intFormMasterID AS id,m_form_master.txtFormName,m_form_master.txtNoDok,
m_form_master_value.txtProductName AS txtNameProduct,m_form_master_value.txtOkp,m_form_master_value.dtmProductionDate AS dtmProductionDate,
m_form_master_value.dtmDateExpired AS dtmDateExpired,m_form_master_value.txtApprovedBy,m_form_master_value.txtProductDesc AS txtProductDesc 
FROM m_form_master,m_form_master_value WHERE m_form_master.intFormMasterID = m_form_master_value.intFormMasterID AND 
m_form_master_value.dtmDeletedAt IS NULL AND m_form_master_value.intFormMasterValueID = $1
              `;

      const queries = await sails.sendNativeQuery(q, [data.id]);
      let formData = queries.rows[0];

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
  getFormValue: async (req, res) => {
    const { id, form_master_id } = req.params;
    try {
      let newGroup = [];
      const formID = await M_Form_Input.findOne({
        where: {
          intFormID: id,
          intFormMasterID: form_master_id,
        },
        select: ["id"],
      });

      console.log(formID);
      if (formID) {
        let parameters = await M_Form_Parameter_Value.find({
          where: {
            intFormInputID: formID.id,
          },
          select: [
            "id",
            "txtParameterName",
            "txtFormVaraibleValue",
            "txtParameterValue",
          ],
        });

        let Grouparameters = parameters.reduce((acc, obj) => {
          const property = obj["txtFormVaraibleValue"];
          acc[property] = acc[property] || [];
          acc[property].push(obj);
          return acc;
        }, {});

        newGroup = Object.keys(Grouparameters).map((x) => {
          let newValue = Grouparameters[x].reduce((obj, current, x) => {
            obj[`column_${x}`] = current.txtParameterValue;

            return obj;
          }, {});
          newValue["lot_number"] = x;
          Grouparameters[x] = newValue; // console.log(value)
          return newValue;
        });
      }

      sails.helpers
        .successResponse({ data: newGroup }, "success")
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
  createFormData: async (req, res) => {
    const { user } = req;
    let { body } = req;
    let parameterValue = [];
    try {
      const formMaster = await M_Form_Master_Value.create({
        txtRevision: "-",
        txtOKP: body.okp,
        txtProductName: body.product_name,
        dtmDateExpired: body.expired_date,
        txtProductDesc: body.product_desc,
        dtmProductionDate: body.product_date,
        txtCreatedBy: user.id,
        txtPreparedBy: user.id,
        txtApprovedBy: "",
        txtClosed: false,
        txtApprove: false,
        intFormMasterID: body.form_master,
      }).fetch();

      const form = await M_Form_Input.create({
        intFormID: body.form,
        intFormMasterID: formMaster.id,
        txtOKP: body.okp,
      }).fetch();

      for (let x = 0; x < body.parameters.length; x++) {
        const element = body.parameters[x];
        parameterValue.push({
          intFormInputID: form.id,
          txtParameterName: element["parameter"],
          txtFormVaraibleValue: element["lot_number"],
          txtParameterValue: element["value"],
          txtCreatedBy: user.id,
        });
      }

      await M_Form_Parameter_Value.createEach(parameterValue).fetch();
      sails.helpers.successResponse(body, "success").then((resp) => {
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
    let parameterValue = [];
    try {
      console.log(body);
      const paramsForm = await M_Form_Input.findOne({
        where: {
          intFormID: body.form,
          intFormMasterID: params.id,
        },
        select: ["id"],
      });

      for (let x = 0; x < body.parameters.length; x++) {
        const element = body.parameters[x];
        parameterValue.push({
          intFormInputID: paramsForm.id,
          txtParameterName: element["parameter"],
          txtFormVaraibleValue: element["lot_number"],
          txtParameterValue: element["value"],
          txtCreatedBy: user.id,
        });
      }

      console.log(parameterValue);

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
  approveFormData: async (req, res) => {
    const { params, user } = req;
    try {
      const data = await M_Form_Master_Value.update({
        id: params.id,
      }).set({
        txtApprove: true,
        txtClosed: true,
        txtApprovedBy: user.username,
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
    const { params, user } = req;
    try {
      const data = await M_Form_Master_Value.update({
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
          SELECT m_form.intFormID AS id,m_form.txtFormName,m_control_points.txtName AS txtNameCP,m_form.dtmCreatedAt AS dtmCreatedAt FROM 
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
  getFormSettingCode: async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    let controlPoints = [];
    let formIds = [];
    try {
      if (user.username == "superadmin") {
        const cp = await M_Control_points.find({
          where: {
            dtmDeletedAt: null,
          },
          select: ["id"],
        });

        controlPoints = cp.map((x) => x.id);
      } else {
        controlPoints = user.cp;
      }

      const formList = await M_Form_Master_List.find({
        where: {
          intFormMasterID: id,
        },
        select: ["intFormID"],
      });

      formIds = formList.map((x) => x.intFormID);

      const forms = await M_Form.find({
        where: {
          dtmDeletedAt: null,
          id: {
            in: formIds,
          },
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
  getFormCode: async (req, res) => {
    const { user } = req;
    const { id } = req.params;
    let controlPoints = [];
    let formIds = [];
    try {
      if (user.username == "superadmin") {
        const cp = await M_Control_points.find({
          where: {
            dtmDeletedAt: null,
          },
          select: ["id"],
        });

        controlPoints = cp.map((x) => x.id);
      } else {
        controlPoints = user.cp;
      }

      const formList = await M_Form_Master_List.find({
        where: {
          intFormMasterID: id,
        },
        select: ["intFormID"],
      });

      formIds = formList.map((x) => x.intFormID);

      const forms = await M_Form.find({
        where: {
          dtmDeletedAt: null,
          intControlPointID: {
            in: controlPoints,
          },
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
      console.log("ID : ", id);
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

      let listParameter = await M_Form_Parameter.find({
        where: {
          intFormID: id,
        },
        select: [
          "intParameterID",
          "txtParameterName",
          "txtParameterType",
          "intMinValue",
          "intMaxValue",
        ],
      });

      listParameter = listParameter.map(async (param) => {
        let standard = "";

        if (param.txtParameterType == "custom") {
          standard =
            param.intMinValue == 0 && param.intMaxValue == 0
              ? "SESUAI STANDARD"
              : param.intMinValue + "-" + param.intMaxValue;
        }
        const paramQuery = await sails.sendNativeQuery(
          `
          SELECT m_ewon_subscriber.intValue FROM m_ewon_subscriber,m_parameter WHERE m_ewon_subscriber.intEwonSubsSettingID = m_parameter.intEwonSubsSettingID
AND m_parameter.txtName = $1 ORDER BY m_ewon_subscriber.dtmCreatedAt DESC LIMIT 1
                `,
          [param.intParameterID]
        );
        paramSetting = paramQuery.rows;

        let value = paramSetting.length > 0 ? paramSetting[0].intValue : "";
        param["values"] = value;
        param["standard"] = standard;
        return param;
      });

      data["parameter"] = await Promise.all(listParameter);

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
      const form = await M_Form.create({
        txtFormName: body.name,
        txtBatchType: body.batch_type,
        txtNoDok: body.no_doc,
        txtRemark: body.remark,
        intControlPointID: body.cp_id,
      }).fetch();

      for (let x = 0; x < body.dataParameter.length; x++) {
        const element = body.dataParameter[x];
        const minValue =
          element.MIN_VALUE != "not defined" && element.MIN_VALUE != ""
            ? element.MIN_VALUE
            : 0;
        const maxValue =
          element.MAX_VALUE != "not defined" && element.MIN_VALUE != ""
            ? element.MAX_VALUE
            : 0;

        console.log("MIN VALUE : ", minValue);
        console.log("MAX VALUE : ", maxValue);

        parameters.push({
          intParameterID: element.TEST_CODE,
          txtParameterName: element.TEST_DESC,
          txtParameterType: element.TYPE_PARAMETER,
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
  updateFormSetting: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    let parameters = [];
    try {
      console.log(body);
      // const form = await M_Form.findOne({
      //   where: {
      //     id: params.id,
      //     dtmDeletedAt: null,
      //   },
      // });

      // if (!form) {
      //   sails.helpers
      //     .errorResponse("form data not found", "failed")
      //     .then((resp) => {
      //       res.status(401).send(resp);
      //     });
      // }
      // await M_Form_Parameter.destroy({
      //   intFormID: params.id,
      // }).fetch();

      // for (let x = 0; x < body.dataParameter.length; x++) {
      //   const element = body.dataParameter[x];
      //   const minValue = element.MIN_VALUE != null && element.MIN_VALUE != "not defined" ? element.MIN_VALUE : 0;
      //   const maxValue = element.MAX_VALUE != null && element.MAX_VALUE != "not defined" ? element.MAX_VALUE : 0;
      //   parameters.push({
      //     intParameterID: element.TEST_CODE,
      //     txtParameterName: element.TEST_DESC,
      //     intMinValue: minValue,
      //     intMaxValue: maxValue,
      //     intFormID: form.id,
      //   });
      // }

      // await M_Form_Parameter.createEach(parameters).fetch();

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

  FormPrint: async (req, res) => {
    const { params } = req;
    try {
      let workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet("My Sheet");
      const file = sails.config.appPath + "/api/file/template.xlsx";
      const formMasterQuery = await sails.sendNativeQuery(
        `SELECT m_form_master.txtFormName AS formName, m_form_master.txtNoDok AS noDoc,m_form_master_value.dtmDateExpired AS expiredDate,m_form_master_value.dtmProductionDate AS productionDate,
        m_form_master_value.txtOKP,m_form_master_value.txtProductDesc,m_form_master_value.txtApprovedBy FROM m_form_master,m_form_master_value WHERE m_form_master.intFormMasterID = m_form_master_value.intFormMasterID AND m_form_master_value.intFormMasterValueID = $1`,
        [params.id]
      );
      const form = formMasterQuery.rows[0];

      let columns = [{ name: "No" }, { name: "Parameter" }];
      let data = [];

      const formQuery = await sails.sendNativeQuery(
        `
      SELECT m_form.txtFormName AS formName, m_form_input.intFormInputID FROM m_form,m_form_input WHERE m_form.intFormID = m_form_input.intFormID AND m_form_input.intFormMasterID = $1
      `,
        [params.id]
      );

      const listForm = formQuery.rows;

      console.log(listForm);

      // const lotNumberQuery = await sails.sendNativeQuery(
      //   `SELECT txtFormVaraibleValue FROM m_form_parameter_value WHERE intFormInputID = $1 GROUP BY txtFormVaraibleValue`,
      //   [params.id]
      // );

      // const parameters = lotNumberQuery.rows;

      // console.log(parameters);
      // for (let index = 0; index < parameters.length; index++) {
      //   const element = parameters[index];

      //   columns.push({ name: element.txtFormVaraibleValue });
      // }

      await workbook.xlsx.readFile(file).then(async () => {
        var worksheet = workbook.getWorksheet(1);
        var rowFirst = worksheet.getRow(1);
        var rowJudul = worksheet.getRow(2);
        var rowThird = worksheet.getRow(3);
        var rowFift = worksheet.getRow(5);
        var rowSix = worksheet.getRow(6);
        var rowSeven = worksheet.getRow(7);

        worksheet.mergeCells("B5:C5");
        rowJudul.getCell(3).value = form.formName;
        rowFirst.getCell(9).value = form.noDoc;
        rowJudul.getCell(9).value = "0";
        rowThird.getCell(9).value = form.expiredDate
          .toISOString()
          .split("T")[0];
        rowFift.getCell(2).value = form.txtProductDesc;
        rowSix.getCell(2).value = form.txtOKP;
        rowSeven.getCell(2).value = form.productionDate
          .toISOString()
          .split("T")[0];

        let startTable = 10;

        for (let x = 0; x < listForm.length; x++) {
          const element = listForm[x];
          worksheet.insertRow(startTable, [
            "NO",
            element.formName,
            "Standard",
            "Lot Number",
          ]);

          const valueQuery = await sails.sendNativeQuery(
            `
          SELECT m_form_parameter_value.txtParameterName,m_form_parameter.intMinValue,m_form_parameter.intMaxValue,m_form_parameter_value.txtFormVaraibleValue,m_form_parameter_value.txtParameterValue FROM m_form_input,m_form_parameter_value,m_form_parameter
WHERE m_form_parameter_value.txtParameterName = m_form_parameter.intParameterID AND m_form_input.intFormInputID = m_form_parameter_value.intFormInputID AND m_form_input.intFormInputID = $1
          `,
            [element.intFormInputID]
          );
          const parameter = valueQuery.rows;
          const result = parameter.reduce(function (r, a) {
            r[a.txtParameterName] = r[a.txtParameterName] || [];
            r[a.txtParameterName].push(a);
            return r;
          }, Object.create(null));
          let index = 1;
          let row = ["", "", ""];
          startTable++;

          const firstObj = result[Object.keys(result)[0]]
          for (let x = 0; x < firstObj.length; x++) {
            const element = firstObj[x];
            row.push(element.txtFormVaraibleValue)
          }
         
          worksheet.insertRow(startTable, row);

          for (const key in result) {
            startTable++;
            const value = result[key];
            let rowValue = [index, key, ""];

            for (let x = 0; x < value.length; x++) {
              const element = value[x];
              rowValue.push(element.txtParameterValue);
            }

            worksheet.insertRow(startTable, rowValue,);
            index++;
          }
          startTable++;
        }




        
        return workbook.xlsx.writeFile(`api/file/${form.formName}.xlsx`);
      });

      const fileReport =
        sails.config.appPath + `/api/file/${form.formName}.xlsx`;
      const filename = `${form.formName}.xlsx`;
      if (fs.existsSync(fileReport)) {
        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + filename
        );

        let filestream = fs.createReadStream(fileReport);
        filestream.pipe(res);
      } else {
        console.log("TIDAK ADA");
      }
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
};

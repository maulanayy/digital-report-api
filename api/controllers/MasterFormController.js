/**
 * MasterFormController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getMasterFormSetting: async (req, res) => {
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
      const count = await M_Form_Master.count(query);
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
              SELECT m_form_master.intFormMasterID AS id,m_form_master.txtFormName,m_form_master.txtNoDok,m_form_master.dtmCreatedAt AS dtmCreatedAt FROM 
              m_form_master WHERE  m_form_master.dtmDeletedAt IS NULL ORDER BY m_form_master.dtmCreatedAt DESC LIMIT $2 OFFSET $1
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
  getMasterFormCode : async (req,res) => {
    const { user } = req;
    let labs = [];
    try {
      if (user.username == "superadmin"){
        const cp = await M_Lab.find({
          where: {
            dtmDeletedAt: null,
          },
          select: ["id"],
        });

        labs = cp.map(x => x.id)

      }else{
        labs = labs.push(user.cp)
      }
      const forms = await M_Form_Master.find({
        where: {
          dtmDeletedAt: null,
          // intLabID : user.lab_id
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
  getOneMasterFormSetting: async (req, res) => {
    const { id } = req.params;
    try {
    
      let data = await M_Form_Master.findOne({
        where : {
          "id" : id
        },
        select : ['txtNoDok','txtFormName','intLabID','txtRemark']
      })
      
      if (!data) {
        sails.helpers.errorResponse("data not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }else{
        const queries = await sails.sendNativeQuery(
          `
                  SELECT m_form_master_list.intFormID AS id,m_form.txtFormName FROM 
                  m_form,m_form_master_list WHERE m_form_master_list.intFormID = m_form.intFormID AND m_form_master_list.dtmDeletedAt IS NULL 
                  AND intFormMasterID = $1
              `,
          [id]
        );
  
        const formList = queries.rows;
        data["form_list"] = formList;
  
        sails.helpers.successResponse(data, "success").then((resp) => {
          res.ok(resp);
        });
      }

      
    } catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  createMasterFormSetting: async (req, res) => {
    const { user } = req;
    let { body } = req;
    let parameters = [];
    try {
        
      const form = await M_Form_Master.create({
        txtFormName: body.name,
        txtNoDok: body.no_doc,
        txtRemark: body.remark,
        intLabID: body.lab_id,
        txtCreatedBy: user.id,
      }).fetch();

      for (let x = 0; x < body.forms.length; x++) {
        const element = body.forms[x]
        parameters.push({
          intFormMasterID: form.id,
          intFormID: element.form_id,
          txtCreatedBy: user.id,
        });
      }

      await M_Form_Master_List.createEach(parameters).fetch();
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
  updateMasterFormSetting: async (req, res) => {
    const { user, params } = req;
    let { body } = req;
    let parameters = [];
    try {
      const MForm = await M_Form_Master.findOne({
        id : params.id
      })

      if (!MForm) {
        sails.helpers.errorResponse("master form not found", "failed").then((resp) => {
          res.status(401).send(resp);
        });
      }

      const data = await M_Form_Master.update({
        id : params.id
      }).set({
        txtFormName : body.name,
        txtNoDok : body.no_doc,
        txtRemark : body.remark,
        intLabID : body.lab_id,
        dtmUpdatedAt: new Date(),
        txtUpdatedBy : user.id
      })

      await M_Form_Master_List.destroy({
        intFormMasterID: params.id,
      });

      for (let x = 0; x < body.forms.length; x++) {
        const element = body.forms[x]
        parameters.push({
          intFormMasterID: params.id,
          intFormID: element.form_id,
          txtCreatedBy: user.id,
        });
      }

      await M_Form_Master_List.createEach(parameters).fetch();

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
  deleteMasterFormSetting: async (req, res) => {
    const { params } = req;
    let { body } = req;
    try {
      const parameter = await M_Form_Master.findOne({
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

      const data = await M_Form_Master.update({
        id: params.id,
      }).set({
        dtmDeletedAt: new Date(),
      });

      await M_Form_Master_List.update({
        intFormMasterID: params.id,
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

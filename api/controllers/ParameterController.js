/**
 * ParameterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const axios = require('axios');
const oracledb = require('oracledb');
const url = "http://localhost:3000"
const configDB = {
  user          : "XXKMIDQM",
  password      : "ora3won01",
  connectString : "10.104.50.30:1521/KMIPROD"
};

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
              ,IF (m_parameter.txtTipe = 'mesin',(SELECT txtTopic FROM m_ewon_subscriber_setting WHERE intEwonSubsSettingID = m_parameter.intEwonSubsSettingID),'-') AS txtTopic,
              m_parameter.dtmCreatedAt FROM m_parameter WHERE m_parameter.dtmDeletedAt IS NULL ORDER BY m_parameter.intParameterID ASC LIMIT $2 OFFSET $1
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
  getDetailParameter : async (req,res) => {
    const {id} = req.params
    try{

      let data = await M_Parameter.findOne({
        where : {
          id : id
        }
      })

      if (!data) {
        sails.helpers.errorResponse("parameter is empty", "failed").then((resp) => {
          res.status(400).send(resp);
        });
      }

      if (data.txtTipe == "formula") {
        const formula = await M_Formula.findOne({
          where : {
            txtParameterID : data.txtName
          },
          select : ['txtParameterOperator','txtOperator','intValueOperator']
        })

        data['formula'] = formula

      }

      sails.helpers.successResponse(data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch(err){
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getParameterOracle : async (req,res) => {
    try{
      const urlOracle = url + "/api/parameter-code"
      const dataOKP = await axios.get(urlOracle)
      let data = dataOKP.data

      data.data.map(dt => {
        
        dt.MIN_VALUE = dt.MIN_VALUE != null && dt.MIN_VALUE != 0 ? dt.MIN_VALUE.toFixed(4) : dt.MIN_VALUE
        dt.MAX_VALUE = dt.MAX_VALUE != null && dt.MAX_VALUE != 0 ? dt.MAX_VALUE.toFixed(4) : dt.MAX_VALUE

        return dt
      })

      // let customParameter = await M_Form_Parameter.find({
      //   where : {
      //     txtParameterType : 'custom'
      //   },
      //   select : ['id','intParameterID','intMinValue','intMaxValue'],
      // })
      
      const queries = await sails.sendNativeQuery(
        `SELECT DISTINCT intParameterID,intMinValue,intMaxValue FROM m_form_parameter WHERE txtParameterType = 'custom'`
      );

      let customParameter = queries.rows;
      
      customParameter = customParameter.map(x => {

        return {
          TEST_CODE: x.intParameterID,
          MIN_VALUE: x.intMinValue,
          MAX_VALUE: x.intMaxValue
        }
      })

      let newData = data.data.concat(customParameter)
      var result = newData.reduce((unique, o) => {
        if(!unique.some(obj => obj.TEST_CODE === o.TEST_CODE && obj.TEST_CODE === o.TEST_CODE)) {
          unique.push(o);
        }
        return unique;
    },[]);
      data.data = result
      sails.helpers.successResponse(data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getOKP : async (req,res) => {
    const { user,query } = req;
    let typeOKP = []
    try{

      const CP = await M_Form.findOne({
        where : {
          id : query.form_id
        },
        select : ['intControlPointID']
      })

      const queriesBatc = await sails.sendNativeQuery(
        `
        SELECT m_type_okp.txtName FROM m_type_okp,m_type_okp_cp WHERE m_type_okp.intTypeOKP = m_type_okp_cp.intTypeOKPID 
        AND m_type_okp.dtmDeletedAt IS NULL AND m_type_okp_cp.intControlPointID IN ($1)
          `,
        [CP.intControlPointID]
      );
      
      typeOKP = queriesBatc.rows

      typeOKP = typeOKP.map(x => x.txtName)

      const body = {
        "type_okp" : typeOKP
      }
      
      const urlOKP = url + "/api/okp"
      const dataOKP = await axios.get(urlOKP,{params : body})

      const result = {
        data : dataOKP.data.data
      }
      sails.helpers.successResponse(result, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getDetailOKP : async (req,res) => {
    const { id } = req.params;
    try{
      const urlOKP = url + "/api/okp/"+id+"/detail-okp"
      const dataOKP = await axios.get(urlOKP)
      
      sails.helpers.successResponse(dataOKP.data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getLOTOKP : async (req,res) => {
    const { id } = req.params;
    try{
      const urlOKP = url + "/api/okp/"+id+"/lot-number"
      const dataOKP = await axios.get(urlOKP)

      
      sails.helpers.successResponse(dataOKP.data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getParameterOKP : async (req,res) => {
    const { search } = req.query
    try{
      const urlOKP = url + "/api/parameter"
      const dataOKP = await axios.get(urlOKP,{params : req.query})
      let data = dataOKP.data

      data.data.map(dt => {
        
        dt.MIN_VALUE = dt.MIN_VALUE != null && dt.MIN_VALUE != 0 ? dt.MIN_VALUE.toFixed(4) : dt.MIN_VALUE
        dt.MAX_VALUE = dt.MAX_VALUE != null && dt.MAX_VALUE != 0 ? dt.MAX_VALUE.toFixed(4) : dt.MAX_VALUE

        return dt
      })

      sails.helpers.successResponse(data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getTestParameter : async (req,res) => {
    const { id } = req.params;
    try{
      const urlOracle = url + "/api/okp/"+id+"/parameter-test"
      const dataOKP = await axios.get(urlOracle)
      
      sails.helpers.successResponse(dataOKP.data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getResult : async (req,res) => {
    try{
      const urlOKP = url + "/api/okp/result"
      const dataOKP = await axios.get(urlOKP)
      
      sails.helpers.successResponse(dataOKP.data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getOneParameter: async (req, res) => {
    const { id } = req.params;
    const { page, limit } = req.query;
    try {

      let dataEwon = [];
      const pagination = {
        page: parseInt(page) - 1 || 0,
        limit: parseInt(limit) || 20,
      };
      const count = await M_Ewon_subscriber.count({
        intEwonSubsSettingID : id
      });
      if (count > 0) {
        const queries = await sails.sendNativeQuery(
          `
          SELECT m_ewon_subscriber_setting.txtTopic, m_ewon_subscriber.intValue, m_ewon_subscriber.dtmCreatedAt FROM
          m_ewon_subscriber_setting,m_ewon_subscriber WHERE m_ewon_subscriber.intEwonSubsSettingID = m_ewon_subscriber_setting.intEwonSubsSettingID
          AND m_ewon_subscriber_setting.intEwonSubsSettingID = 1 ORDER BY m_ewon_subscriber.dtmCreatedAt DESC LIMIT $1 OFFSET $2
          `,
          [pagination.limit,pagination.page * pagination.limit]
        )
        dataEwon = queries.rows;
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

      let graph = await M_Ewon_subscriber.find({
        where : {
          intEwonSubsSettingID : id,
        },
        select : ['dtmCreatedAt','intValue']
      }).sort("dtmCreatedAt DESC");

      graph = graph.map(res => {
        return {
          x : res.dtmCreatedAt,
          y : res.intValue
        }
      })


      const data = {
        data : dataEwon,
        meta : meta,
        graph : graph
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
  getOneParameterOracle : async (req,res) => {
    const { id } = req.params;
    try{
      console.log("ID : ",id)
      const urlOKP = url + "/api/parameter/"+id+"/detail"
      const dataOKP = await axios.get(urlOKP)
      sails.helpers.successResponse(dataOKP.data.data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getOneParameterForm : async (req,res) => {
    const { id } = req.params;
    try{

      const data = await M_Form_Parameter.findOne({
        where: {
          intParameterID: id,
        },
        select: ["id", "intParameterID","txtParameterName","txtParameterType"],
      });

      sails.helpers.successResponse(data, "success").then((resp) => {
        res.ok(resp);
      });
    }catch(err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
  getValue : async (req,res) => {
    try {
      const { id } = req.params;
      const dataParameter = await M_Parameter.findOne({
        where: {
          txtName: id,
          dtmDeletedAt: null,
        },
        select: ["id", "intEwonSubsSettingID", "txtTipe"],
      });

      if (dataParameter) {

        if (dataParameter.txtTipe == "mesin"){
          const value = await M_Ewon_subscriber.find({
            where : {
              intEwonSubsSettingID : dataParameter.intEwonSubsSettingID
            }
          }).sort([{
            dtmCreatedAt : 'DESC'
          }]).limit(1)
  
          dataParameter['value']  = value[0].intValue
        }
        
        if (dataParameter.txtTipe == "oracle") {
          dataParameter['value']  = 0
        }
      }
      
      sails.helpers.successResponse(dataParameter, "success").then((resp) => {
        res.ok(resp);
      });
      
    }catch (err){
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
        txtName: body.oracle_id,
        txtTestCode : body.test_oracle_id,
        txtTipe: body.tipe,
        intEwonSubsSettingID: body.topic_id,
        txtCreatedBy: user.id,
      }).fetch();
      if (body.tipe == "formula") {
        await M_Formula.create({
          txtParameterID : body.oracle_id,
          intValueOperator : body.operator_value,
          txtOperator : body.operator,
          txtParameterOperator : body.operator_parameter,
          txtCreatedBy: user.id,
        })
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
            res.status(400).send(resp);
          });
      }

      const data = await M_Parameter.update({
        id: params.id,
      }).set({
        txtName: body.oracle_id,
        txtTipe: body.tipe,
        txtTestCode : body.test_oracle_id,
        intEwonSubsSettingID: body.topic_id,
        txtUpdatedBy: user.id,
        dtmUpdatedAt: new Date(),
      });

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
                res.status(400).send(resp);
              });
          }
    
          const data = await M_Parameter.update({
            id: params.id,
          }).set({
            dtmDeletedAt: new Date(),
          });
          
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
  getParameterLotNumber : async (req,res) => {
    const { id } = req.params;
    try{ 
      let data = []
      console.log("HIT OKP PARAMETER")
      const urlOKP = url + "/api/okp/"+id+"/parameter"
      const dataOKP = await axios.get(urlOKP)

      console.log(dataOKP.data.data)
      // conn = await oracledb.getConnection(configDB)

      // const queryIL = await conn.execute(
      //   `SELECT KMI_DQM_RESULTS_V.TEST_CODE,KMI_DQM_RESULTS_V.MIN_VALUE_NUM,KMI_DQM_RESULTS_V.MAX_VALUE_NUM,
      //   KMI_DQM_RESULTS_V.RESULT_VALUE_NUM, KMI_DQM_RESULTS_V.RESULT_VALUE_CHAR
      //                   FROM KMI_DQM_SAMPLES_V,KMI_DQM_RESULTS_V
      //                   WHERE KMI_DQM_RESULTS_V.SAMPLE_ID = KMI_DQM_SAMPLES_V.SAMPLE_ID 
      //                   AND KMI_DQM_SAMPLES_V.LOT_NUMBER = :id
      //   `,[id]
      // )

      // data = queryIL.rows

      sails.helpers.successResponse({data : dataOKP.data.data}, "success").then((resp) => {
        res.ok(resp);
      });
    }catch (err) {
      console.log("ERROR : ", err);
      sails.helpers.errorResponse(err.message, "failed").then((resp) => {
        res.status(400).send(resp);
      });
    }
  },
};

/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "/": { view: "pages/homepage" },

  //User
  "get /user": "UserController.getAll",
  "get /user/:id": "UserController.getOne",
  "post /login": "UserController.login",
  "post /user": "UserController.create",
  "post /user/reset-password": "UserController.resetPassword",
  "put /user/:id": "UserController.update",
  "delete /user/:id": "UserController.delete",

  //Lab
  "get /lab": "LabController.getAll",
  "get /lab/:id": "LabController.getOne",
  "get /lab/code": "LabController.getCode",
  "post /lab": "LabController.create",
  "put /lab/:id": "LabController.update",
  "delete /lab/:id": "LabController.delete",

  //Area
  "get /area": "AreaController.getAll",
  "get /area/:id": "AreaController.getOne",
  "get /area/code": "AreaController.getCode",
  "post /area": "AreaController.create",
  "put /area/:id": "AreaController.update",
  "delete /area/:id": "AreaController.delete",

  //Control Point
  "get /control-point": "ControlPointController.getAll",
  "get /control-point/parameter": "ControlPointController.getAllWithParameter",
  "get /control-point/:id": "ControlPointController.getOne",
  "get /control-point/code": "ControlPointController.getCode",
  "post /control-point": "ControlPointController.create",
  "put /control-point/:id": "ControlPointController.update",
  "delete /control-point/:id": "ControlPointController.delete",

  //Role
  "get /role": "RoleController.getAll",
  "get /role/:id": "RoleController.getOne",
  "get /role/code": "RoleController.getCode",
  "post /role": "RoleController.create",
  "put /role/:id": "RoleController.update",
  "delete /role/:id": "RoleController.delete",

  //Paramater
  "get /parameter": "ParameterController.getParameter",
  "get /parameter/:id" : "ParameterController.getDetailParameter",
  "post /parameter": "ParameterController.createParameter",
  "put /parameter/:id": "ParameterController.updateParameter",
  "delete /parameter/:id": "ParameterController.deleteParameter",

  "get /parameter/oracle-code": "ParameterController.getParameterOracle",
  "get /parameter/oracle-parameter": "ParameterController.getParameterOKP",
  "get /parameter/okp": "ParameterController.getOKP",
  "get /parameter/:id/okp-detail": "ParameterController.getDetailOKP",
  "get /parameter/:id/okp-lot": "ParameterController.getLOTOKP",
  "get /parameter/oracle/:id/test": "ParameterController.getTestParameter",
  "get /parameter/:id/value": "ParameterController.getValue",
  "get /parameter/:id/detail  ": "ParameterController.getOneParameter",
  "get /parameter/:id/oracle  ": "ParameterController.getOneParameterOracle",
  "get /parameter/:id/form": "ParameterController.getOneParameterForm",
  "get /parameter/:cp_id/control-point": "ParameterController.getParameterByCP",
  "get /parameter/:id/lot-number" : "ParameterController.getParameterLotNumber",

  //Paramater Value
  "get /parameter-value": "ParameterValueController.getParameter",
  "get /parameter-value/:id" : "ParameterValueController.getDetailParameter",
  "post /parameter-value": "ParameterValueController.createParameter",
  "put /parameter-value/:id": "ParameterValueController.updateParameter",
  "delete /parameter-value/:id": "ParameterValueController.deleteParameter",

  //Form Data
  "get /form-data": "FormParameterController.getFormData",
  "get /form-data/:id": "FormParameterController.getOneFormData",
  "get /form-data/:id/value/:form_master_id": "FormParameterController.getFormValue",
  "post /form-data": "FormParameterController.createFormData",
  "put /form-data/:id": "FormParameterController.updateFormData",
  "put /form-data/:id/approve": "FormParameterController.approveFormData",
  "put /form-data/:id/close": "FormParameterController.closeFormData",
  "get /form-data/print/:id": "FormParameterController.FormPrint",
  "get /form-data-parameter": "FormParameterController.getFormDataParameter",

  //Form Parameter
  "get /form-parameter": "FormParameterController.getFormSetting",
  "get /form-parameter/:id": "FormParameterController.getOneFormSetting",
  "post /form-parameter": "FormParameterController.createFormSetting",
  "put /form-parameter/:id": "FormParameterController.updateFormSetting",
  "delete /form-parameter/:id": "FormParameterController.deleteFormSetting",
  "get /form-parameter/:id/code": "FormParameterController.getFormSettingCode",
  "get /form-parameter/code/list": "FormParameterController.getFormCode",
  "get /form-parameter/:id/parameter": "FormParameterController.getParameterForm",

  // Master Form

  "get /master-form": "MasterFormController.getMasterFormSetting",
  "get /master-form/code": "MasterFormController.getMasterFormCode",
  "get /master-form/:id": "MasterFormController.getOneMasterFormSetting",
  "post /master-form": "MasterFormController.createMasterFormSetting",
  "put /master-form/:id": "MasterFormController.updateMasterFormSetting",
  "delete /master-form/:id": "MasterFormController.deleteMasterFormSetting",
  
  //Setting Ewon
  "get /setting/ewon": "SettingController.getEwon",
  "get /setting/ewon/:id": "SettingController.getOneEwon",
  "get /setting/ewon/code": "SettingController.getEwonCode",
  "post /setting/ewon": "SettingController.createEwon",
  "put /setting/ewon/:id": "SettingController.updateEwon",
  "delete /setting/ewon/:id": "SettingController.deleteEwon",
  
  //Setting Oracle
  "get /setting/oracle": "SettingController.getOracle",
  "get /setting/oracle/:id": "SettingController.getOneOracle",
  "post /setting/oracle": "SettingController.createOracle",
  "put /setting/oracle/:id": "SettingController.updateOracle",
  "delete /setting/oracle/:id": "SettingController.deleteOracle",
  
  //Setting Type OKP
  "get /setting/type-okp": "SettingController.getTypeOKP",
  "get /setting/type-okp/:id": "SettingController.getOneTypeOKP",
  "get /setting/type-okp/code": "SettingController.getTypeOKPCode",
  "post /setting/type-okp": "SettingController.createTypeOKP",
  "put /setting/type-okp/:id": "SettingController.updateTypeOKP",
  "delete /setting/type-okp/:id": "SettingController.deleteTypeOKP",
  
  //Setting Password
  "get /setting/password" : "SettingController.GetPassword",
  "post /setting/password" : "SettingController.CreatePassword",
  

  //shift
  "get /shift": "ShiftController.getAll",
  "get /shift/:id": "ShiftController.getOne",
  "post /shift": "ShiftController.create",
  "put /shift/:id": "ShiftController.update",
  "delete /shift/:id": "ShiftController.delete",

  //Dashboard
  "get /dashboard": "DashboardController.getAll",
  "get /dashboard/group": "DashboardController.getGroup",
  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};

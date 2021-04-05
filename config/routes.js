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

  '/': { view: 'pages/homepage' },

  //User
  "get /user" : "UserController.getAll",
  "get /user/:id" : "UserController.getOne",
  "post /login" : "UserController.login",
  "post /user" : "UserController.create",
  "put /user/:id" : "UserController.update",
  "delete /user/:id" : "UserController.delete",

  //Lab
  "get /lab" : "LabController.getAll",
  "get /lab/:id" : "LabController.getOne",
  "get /lab/code" : "LabController.getCode",
  "post /lab" : "LabController.create",
  "put /lab/:id" : "LabController.update",
  "delete /lab/:id" : "LabController.delete",

  //Area
  "get /area" : "AreaController.getAll",
  "get /area/:id" : "AreaController.getOne",
  "get /area/code" : "AreaController.getCode",
  "post /area" : "AreaController.create",
  "put /area/:id" : "AreaController.update",
  "delete /area/:id" : "AreaController.delete",

  //Control Point
  "get /control-point" : "ControlPointController.getAll",
  "get /control-point/parameter" : "ControlPointController.getAllWithParameter",
  "get /control-point/:id" : "ControlPointController.getOne",
  "get /control-point/code" : "ControlPointController.getCode",
  "post /control-point" : "ControlPointController.create",
  "put /control-point/:id" : "ControlPointController.update",
  "delete /control-point/:id" : "ControlPointController.delete",

  //Role
  "get /role" : "RoleController.getAll",
  "get /role/:id" : "RoleController.getOne",
  "get /role/code"  : "RoleController.getCode",
  "post /role" : "RoleController.create",
  "put /role/:id" : "RoleController.update",
  "delete /role/:id" : "RoleController.delete",

  //Setting

  "get /setting/ewon"  : "SettingController.getEwon",
  "get /setting/ewon/:id"  : "SettingController.getOneEwon",
  "get /setting/ewon/code"  : "SettingController.getEwonCode",
  "get /setting/oracle" : "SettingController.getOracle",
  "get /setting/oracle/:id"  : "SettingController.getOneOracle",
  "get /setting/parameter" : "SettingController.getParameter",
  "get /setting/parameter/:id" : "SettingController.getOneParameter",
  "get /setting/parameter/:cp_id/control-point" : "SettingController.getParameterByCP",
  "post /setting/parameter" : "SettingController.createParameter",
  "post /setting/ewon" : "SettingController.createEwon",
  "post /setting/oracle" : "SettingController.createOracle",
  "put /setting/ewon/:id" : "SettingController.updateEwon",
  "put /setting/oracle/:id" : "SettingController.updateOracle",
  "put /setting/parameter/:id" : "SettingController.updateParameter",
  "delete /setting/ewon/:id" : "SettingController.deleteEwon",
  "delete /setting/oracle/:id" : "SettingController.deleteOracle",
  "delete /setting/parameter/:id" : "SettingController.deleteParameter",
  "get /setting/form" : "SettingController.getFormSetting",
  "get /setting/form/:id" : "SettingController.getOneFormSetting",
  "get /setting/form/:id/parameter" : "SettingController.getParameterForm",
  "post /setting/form" : "SettingController.createFormSetting",
  "post /setting/form/variable" : "SettingController.createFormVariableSetting",
  

  //Permission
  "get /permission" : "PermissionController.getAll"
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

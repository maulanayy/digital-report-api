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
  "post /lab" : "LabController.create",
  "put /lab/:id" : "LabController.update",
  "delete /lab/:id" : "LabController.delete",

  //Area
  "get /area" : "AreaController.getAll",
  "get /area/:id" : "AreaController.getOne",
  "post /area" : "AreaController.create",
  "put /area/:id" : "AreaController.update",
  "delete /area/:id" : "AreaController.delete",

  //Control Point
  "get /control-point" : "ControlPointController.getAll",
  //Role
  "get /role" : "RoleController.getAll",

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

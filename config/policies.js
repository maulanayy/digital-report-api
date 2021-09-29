/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const { resetPassword } = require("../api/controllers/UserController")

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': true,
  UserController : {
    login : true,
    "resetPassword" : true,
    "*" : "isAuthenticated"
  },
  LabController : {
    "*" : "isAuthenticated"
  },
  AreaController : {
    "*" : "isAuthenticated"
  },
  ControlPointController : {
    "*" : "isAuthenticated"
  },
  FormParameterController : {
    FormPrint : true,
    "*" : "isAuthenticated"
  },
  ParameterController : {
    "*" : "isAuthenticated"
  },
  SettingController : {
    "*" : "isAuthenticated"
  },
  ShiftController : {
    "*" : "isAuthenticated"
  },
  MasterFormController : {
    "*" : "isAuthenticated"
  }

};

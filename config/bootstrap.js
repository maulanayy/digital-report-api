/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```


  const roleSuperadmin = await M_Roles.findOne({
    where : {
      txtName : "superadmin"
    }
  })


  if (!roleSuperadmin){
    const role = await M_Roles.create({
        txtName: "superadmin",
      }).fetch();
    
      
      await M_Roles.createEach([
        {txtName: "admin"},
        {txtName: "supervisor"},
        {txtName: "inspector"},
        {txtName: "leader"},
        {txtName: "guest"},
      ])
    
    
      await M_Users.create({
        txtUsername: "superadmin",
        txtPassword: "superadmin",
        txtName: "superadmin",
        txtDepartment: "IT",
        txtRelationship: "single",
        txtSex: "Male",
        dtmBirtDate: "1993-2-2",
        intAge: 23,
        intRoleID: role.id,
        intLabID: 0,
      })
    } 
  

  // 
};

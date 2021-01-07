module.exports = {


  friendlyName: 'Success response',


  description: 'Create success Response',


  inputs: {
    data : {
      friendlyName : "Data of Response",
      description : "Data result of process",
      type : {}
    },
    message : {
      friendlyName : "Message of Response",
      description : "Message result of process",
      type : "string"
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs,exits) {
    // TODO
    const response = {
      status : 200,
      message : inputs.message,
      data : inputs.data
    }
    return exits.success(response)
  }


};


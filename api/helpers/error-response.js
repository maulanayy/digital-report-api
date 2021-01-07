module.exports = {


  friendlyName: 'Error response',


  description: 'Create Error Response',


  inputs: {
    data : {
      friendlyName : "Data of Response",
      description : "Data result of process",
      type : "string"
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
      status : 400,
      message : inputs.message,
      data : inputs.data
    }
    return exits.success(response)
  }


};


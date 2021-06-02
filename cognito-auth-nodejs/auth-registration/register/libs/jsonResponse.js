exports.format = (statusCode, response) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify(response)
    }
  };
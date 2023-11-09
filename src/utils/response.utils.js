const response = (res, status, success, message, data) => {
  const result = {};
  result.status = status;
  result.message = message;
  result.success = success;
  result.message = message;
  result.data = data;

  return res.status(result.status).json(result);
};

const errorsCustomMessage = (errors) => {
  return errors.details.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.path]: curr.message
    }),
    {}
  );
};

const responseValidationError = (res, errors) => {
  const result = {};
  result.status = 422;
  result.success = false;
  result.message = 'The given data was invalid.';
  result.errors = errorsCustomMessage(errors);

  return res.status(result.status).json(result);
};

module.exports = { response, responseValidationError };

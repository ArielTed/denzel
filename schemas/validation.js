const Joi = require('@hapi/joi');

const searchValidation = (data) => {
  const schema = Joi.object({
		date: Joi.date()
			.required(),
    review: Joi.string()
      .required()
  });
  return schema.validate(data);
};

module.exports = {
  searchValidation
}

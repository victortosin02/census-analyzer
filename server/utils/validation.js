// Use import syntax instead of require
import Joi from "joi";

// Validation rules aligned with db.js schema
const mapItemValidation = async(field) => {
    const schema = Joi.object({
        occupation: Joi.string().required(),
        minIncome: Joi.number().integer().required(),
        maxIncome: Joi.number().integer().required(),
        minFamilySize: Joi.number().integer().required(),
        maxFamilySize: Joi.number().integer().required(),
    });

    try {
        return await schema.validateAsync(field, { abortEarly: false });
    } catch (err) {
        return err;
    }
};

// Export the validation function as an ES module
export { mapItemValidation };
// middleware/validateRequest.js
import Joi from "joi";

export function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details.map(d => d.message).join(", ") });
    }
    next();
  };
}

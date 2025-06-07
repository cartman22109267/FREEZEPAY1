// backend/payment/middleware/validatePayment.js
import Joi from "joi";

const qrSchema = Joi.object({
  qrId: Joi.string().uuid().required()
});
const bluetoothSchema = Joi.object({
  payeeId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required()
});

export function validateQrPayload(req, res, next) {
  const { error } = qrSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

export function validateBluetoothPayload(req, res, next) {
  const { error } = bluetoothSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
}

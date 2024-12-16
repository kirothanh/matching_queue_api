const { object, string, number } = require("yup");

module.exports = {
  registerSchema: object({
    name: string().required().min(3),
    email: string().email(),
    phone: string().required().min(10).max(11),
    password: string().required().min(6),
  }),
  loginSchema: object({
    email: string().email().required(),
    password: string().required().min(6),
  }),
}
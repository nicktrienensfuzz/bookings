const mongoose = require('mongoose');

const loginSchema = mongoose.Schema({
  body: String
});

const Login = mongoose.model('Login', loginSchema);

module.exports = Login;

require('dotenv').config();

class Logger {
  static log(data) {
    if (Number(process.env.LOG_LEVEL) === 1) {
      console.log(data)
    }
  }
  static debug(data) {
    if (Number(process.env.LOG_LEVEL) === 2) {
      console.log(data)
    }
  }
}

module.exports = Logger;

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05 reworked 2020-05-02
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

/**
 * Creates logger using winston and morgan,
 * it also provide support to custom transport with the ELK suite.
 * @class Log
 */
class Log {
  /**
   *
   * @param {Object} opts The options to configure the server (Default: {})
   * @param {Object} log Custom logger function (Default: console)
   * @constructor
   */
  constructor(opts = {}, log = console) {
    this.config = opts;
    this.log = log;
  }

  /**
   * It create a logger using winston
   * @returns {Object} Returns the log function
   */
  CreateLogger() {
    this.log = require("./winston/index")(this.config);
    return this.log;
  }

  /**
   * It instantiates the request interceptor
   * @returns {Function} It return the request interceptor to be used with an express app 'app.use()'
   */
  OnRequest() {
    this.log.info("Webux-logging - Configuring the `on request` interceptor");

    return require("./morgan/onRequest")(
      this.config.type,
      this.config.format,
      this.config.tokens,
      this.log
    );
  }
}

module.exports = Log;

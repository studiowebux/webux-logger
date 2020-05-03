/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2019-05-25
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const morgan = require("morgan");
const json = require("morgan-json");
const defaultTokens = require("./defaultRequest");

/**
 * this function calls the stream function of winston, it logs the request content.
 * @param {String} type The logging type : json, combined, tiny, dev, common, short, by default: common
 * @param {Object} format The object that contains the structure of what to log. Must be use with the JSON type.
 * @param {Object} tokens To overwrite the default tokens provided, read the morgan token documentation for more details.
 * @param {Object} log The log function, optional
 * @returns {VoidFunction} return nothing
 */
const Logging = (
  type = "common",
  format = null,
  tokens = null,
  log = console
) => {
  log.info("Webux-logging - Configuring morgan");

  // Load tokens to intercept and log.
  if (!tokens) {
    tokens = defaultTokens;
  }
  tokens.forEach((token) => {
    log.debug(`webux-logging - Adding token '${token.name}' on request`);
    morgan.token(token.name, function (req, res) {
      let value = token.value ? token.value : token.name;
      let request = token.parent ? req[token.parent][value] : req[value];

      if (token.needStringify === true) {
        return JSON.stringify(request);
      } else {
        return request;
      }
    });
  });

  // To log in JSON format or in some other format,
  // It uses the stream function and filter the request
  // It sanitize the content to remove blacklisted
  // information from the log
  if (type === "json") {
    try {
      return morgan(json(format), {
        stream: log.stream,
      });
    } catch (e) {
      log.error("Webux-logging - " + e.message);
    }
  } else {
    try {
      return morgan(type, {
        stream: log.stream,
      });
    } catch (e) {
      log.error("Webux-logging - " + e.message);
    }
  }
};

module.exports = Logging;

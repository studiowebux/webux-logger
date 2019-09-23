// ███╗   ███╗██╗██████╗ ██████╗ ██╗     ███████╗██╗    ██╗ █████╗ ██████╗ ███████╗
// ████╗ ████║██║██╔══██╗██╔══██╗██║     ██╔════╝██║    ██║██╔══██╗██╔══██╗██╔════╝
// ██╔████╔██║██║██║  ██║██║  ██║██║     █████╗  ██║ █╗ ██║███████║██████╔╝█████╗
// ██║╚██╔╝██║██║██║  ██║██║  ██║██║     ██╔══╝  ██║███╗██║██╔══██║██╔══██╗██╔══╝
// ██║ ╚═╝ ██║██║██████╔╝██████╔╝███████╗███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗
// ╚═╝     ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

/**
 * File: index.js
 * Author: Tommy Gingras
 * Date: 2018-07-05
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, json, colorize } = format;
const { LogstashTransport } = require("winston-logstash-transport");
const { filterSecret } = require("./lib/functions");

/**
 * Create a custom logger with or without options.
 * @param {Object} options The configuration of the module, Optional
 * @return {Object} Return the logger.
 */
module.exports = (options = {}) => {
  let logger = createLogger({
    defaultMeta: options.meta,
    format: combine(
      label({
        label: options.application_id || "No label defined."
      }),
      filterSecret(options.blacklist)(),
      timestamp(),
      json(),
      colorize()
    )
  });

  // For each files defined in the options
  // link the filename and the error level.
  if (options.filenames) {
    Object.keys(options.filenames).forEach(level => {
      if (!options.filenames[level]) {
        throw new Error("Invalid file provided");
      }

      logger.add(
        new transports.File({
          level: level,
          filename: options.filenames[level]
        })
      );
    });
  }

  // Logstash configuration is defined
  if (options.logstash && options.logstash.host && options.logstash.port) {
    logger.add(
      new LogstashTransport({
        host: options.logstash.host,
        port: options.logstash.port
      })
    );
  }

  // add console redirection if not in production or forced to do.
  if (options.forceConsole === true || process.env.NODE_ENV != "production") {
    logger.add(
      new transports.Console({
        level: options.consoleLevel || "silly",
        format: format.simple()
      })
    );
  }

  //define the stream object for morgan
  logger.stream = {
    write: (message, encoding) => {
      let object = {
        message: "Logging using stream function"
      };

      let cleaned = JSON.parse(message);
      cleaned.body = JSON.parse(message).body
        ? JSON.parse(JSON.parse(message).body)
        : {};
      cleaned.params = JSON.parse(message).params
        ? JSON.parse(JSON.parse(message).params)
        : {};
      cleaned.headers = JSON.parse(message).headers
        ? JSON.parse(JSON.parse(message).headers)
        : {};

      logger.info({ ...object, ...cleaned });
    }
  };

  return logger;
};

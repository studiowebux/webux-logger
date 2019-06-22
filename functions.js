// ███╗   ███╗██╗██████╗ ██████╗ ██╗     ███████╗██╗    ██╗ █████╗ ██████╗ ███████╗
// ████╗ ████║██║██╔══██╗██╔══██╗██║     ██╔════╝██║    ██║██╔══██╗██╔══██╗██╔════╝
// ██╔████╔██║██║██║  ██║██║  ██║██║     █████╗  ██║ █╗ ██║███████║██████╔╝█████╗
// ██║╚██╔╝██║██║██║  ██║██║  ██║██║     ██╔══╝  ██║███╗██║██╔══██║██╔══██╗██╔══╝
// ██║ ╚═╝ ██║██║██████╔╝██████╔╝███████╗███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗
// ╚═╝     ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

/**
 * File: functions.js
 * Author: Tommy Gingras
 * Date: 2019-06-22
 * License: All rights reserved Studio Webux S.E.N.C 2015-Present
 */

"use strict";

const _ = require("lodash");
const { format } = require("winston");

const hasBlacklist = (object, parent, child, find) => {
  if (
    typeof parent[child] === "object" &&
    Object.keys(parent[child]).length > 0
  ) {
    object[child] = {};
    Object.keys(parent[child]).forEach(element => {
      hasBlacklist(object[child], parent[child], element, find);
    });
  } else {
    if (child === find) {
      parent[child] = "*****";
    }
    object[child] = parent[child];
  }

  return object;
};

const filterSecret = options => {
  return format((info, opts) => {
    let cleaned = {
      body: {},
      headers: {},
      params: {}
    };

    // apply only if object, body params or headers
    if (
      options.blacklist &&
      info &&
      (info.body || info.params || info.headers)
    ) {
      // do it
      options.blacklist.forEach(blacklist => {
        // check if body does not contains blacklisted element.
        if (typeof info.body === "object") {
          Object.keys(info.body).forEach(body => {
            hasBlacklist(cleaned.body, info.body, body, blacklist);
          });
        }

        if (typeof info.headers === "object") {
          Object.keys(info.headers).forEach(header => {
            hasBlacklist(cleaned.headers, info.headers, header, blacklist);
          });
        }

        if (typeof info.params === "object") {
          Object.keys(info.params).forEach(param => {
            hasBlacklist(cleaned.params, info.params, param, blacklist);
          });
        }
      });

      info.body = cleaned.body;
      info.params = cleaned.params;
      info.headers = cleaned.headers;

      //logstash required that empty objects are removed ...
      Object.keys(info).forEach(item => {
        if (_.isEmpty(info[item])) {
          delete info[item];
        }
      });
      return info;
    }

    return info;
  });
};

module.exports = {
  filterSecret
};

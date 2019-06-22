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

function isJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return false;
  }
}

const filterSecret = options => {
  return format((info, opts) => {
    console.log(info)
    let cleaned = {
      body: {},
      headers: {},
      params: {}
    };

    if (options.blacklist && info.message) {
      
      let parsedMessage =
        isJSON(info.message) && typeof info.message === "string"
          ? JSON.parse(info.message)
          : info.message;
      const Body = isJSON(parsedMessage.body || "")
        ? JSON.parse(parsedMessage.body)
        : {};
      const Headers = isJSON(parsedMessage.headers || "")
        ? JSON.parse(parsedMessage.headers)
        : {};
      const Params = isJSON(parsedMessage.params || "")
        ? JSON.parse(parsedMessage.params)
        : {};

      options.blacklist.forEach(blacklist => {
        console.log("Check for : " + blacklist)
        console.log(cleaned)
        if (parsedMessage.body) {
          Object.keys(Body).forEach(body => {
            hasBlacklist(cleaned.body, Body, body, blacklist);
          });
        }
        if (parsedMessage.headers) {
          Object.keys(Headers).forEach(header => {
            hasBlacklist(cleaned.headers, Headers, header, blacklist);
          });
        }
        if (parsedMessage.params) {
          Object.keys(Params).forEach(param => {
            hasBlacklist(cleaned.params, Params, param, blacklist);
          });
        }
      });

      console.log("Finished !")

      let _c = parsedMessage;
      if (cleaned && !_.isEmpty(cleaned)) {
        if (cleaned.body && !_.isEmpty(cleaned.body)) {
          _c.body = cleaned.body;
        }
        if (cleaned.params && !_.isEmpty(cleaned.params)) {
          _c.params = cleaned.params;
        }
        if (cleaned.headers && !_.isEmpty(cleaned.headers)) {
          _c.headers = cleaned.headers;
        }
      }

      info.message = JSON.stringify(_c);

      return info;
    } else {
      return info;
    }
  });
};

module.exports = {
  filterSecret
};

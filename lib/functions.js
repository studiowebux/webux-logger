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
const cluster = require("cluster");

/**
 * Check if the parent/child contain a blacklisted element, if so, update the value to *****
 * @param {Object} processed The empty object, it will be use to append the new values, Mandatory
 * @param {Object} parent The full object to process, Mandatory
 * @param {Object} child an object contained in the parent, the one to process in that sequence, Mandatory
 * @param {String} find The value that is blacklisted and searched for, Mandatory
 * @return {Object} Return the new entry with the modified values if applicable.
 */
const hasBlacklist = (processed, parent, child, find) => {
  // if the current element contains an object,
  if (
    typeof parent[child] === "object" &&
    Object.keys(parent[child]).length > 0
  ) {
    // create the hierarchy to append the values.
    processed[child] = {};
    // loop within the new temporary parent and use a recursive function.
    Object.keys(parent[child]).forEach(element => {
      hasBlacklist(processed[child], parent[child], element, find);
    });
  } else {
    // if the current element does not contain an object, but a blacklisted element
    if (child === find) {
      parent[child] = "*****";
    }
    // in all cases append the value in the new object.
    processed[child] = parent[child];
  }

  return processed; // return the processed object.
};

/**
 * Get the entry to be process
 * we only filter on body, headers and params
 * @param {Object} blacklist The array of blacklisted elements, Mandatory
 * @return {Object} Return the new entry with the modified values if applicable.
 */
const filterSecret = blacklist => {
  return format((info, opts) => {

    // to track on which CPU the task is ran
    info.instance = (cluster.worker ? cluster.worker.id : 1).toString();

    // apply only if object, body params or headers
    if (blacklist && info && (info.body || info.params || info.headers)) {
      let cleaned = {
        body: {},
        headers: {},
        params: {}
      };

      // for each blacklisted element,
      blacklist.forEach(item => {
        // check if body does not contains blacklisted element.
        if (typeof info.body === "object") {
          Object.keys(info.body).forEach(body => {
            hasBlacklist(cleaned.body, info.body, body, item);
          });
        }
        // check if headers does not contains blacklisted element.

        if (typeof info.headers === "object") {
          Object.keys(info.headers).forEach(header => {
            hasBlacklist(cleaned.headers, info.headers, header, item);
          });
        }
        // check if params does not contains blacklisted element.

        if (typeof info.params === "object") {
          Object.keys(info.params).forEach(param => {
            hasBlacklist(cleaned.params, info.params, param, item);
          });
        }
      });

      // Create the new object
      info.body = cleaned.body;
      info.params = cleaned.params;
      info.headers = cleaned.headers;
      info.filtered = "Yes";

      //logstash required that empty objects are removed ...
      Object.keys(info).forEach(item => {
        if (_.isEmpty(info[item])) {
          info[item] = "{}";
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

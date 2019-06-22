const options = {
  application_id: "Test01",
  forceConsole: false,
  logstash: {
    host: "127.0.0.1",
    port: "5000" // udp only !
  },
  filenames: {
    error: "log/error.log",
    warn: "log/warn.log",
    info: "log/info.log",
    verbose: "log/verbose.log",
    debug: "log/debug.log",
    silly: "log/silly.log"
  },
  blacklist: ["password", "authorization"]
};

const webuxlogger = require("../index")(options);

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5
// };

webuxlogger.error("An error occur");
webuxlogger.info("An info occur");
webuxlogger.debug("An debug occur");
webuxlogger.warn({
  message: "watch out ! this is a json !",
  success: false,
  status: 500
});

webuxlogger.info({
  body: {
    password: "JENAGUY",
    user: "PAul",
    email: "john@boby.com",
    lastLogin: "2019-04-05"
  },
  message: "bla bla bla",
  status: 201,
  success: true
});

webuxlogger.info({
  "@timestamp": "2019-09-30T05:09:08.282Z",
  message: "Some log message",
  severity: "info",
  fields: {
    method: "GET",
    url: "/sitemap.xml",
    headers: {
      host: "www.example.com",
      "user-agent":
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      accept: "*/*",
      "accept-encoding": "gzip,deflate",
      from: "googlebot(at)googlebot.com",
      "if-modified-since": "Tue, 30 Sep 2019 11:34:56 GMT",
      "x-forwarded-for": "66.249.78.19"
    }
  }
});

webuxlogger.info({
  message: "why ???",
  fields: {
    method: "POST",
    url: "/create",
    status: "201",
    body:
      '{"notification":{"deviceID":"5cf0524c29b376c575e6005b","message":"Door Open","password":"password !"}}',
    params: "{}",
    query: "{}",
    headers:
      '{"content-type":"application/json","lang":"es","cache-control":"no-cache","authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc1ZhbGlkYXRlZCI6dHJ1ZSwiYXV0aG9yaXplZFRpbWUiOiIyMDE5LTAzLTA0VDIxOjIxOjI3LjM1NFoiLCJhdXRob3JpemVkIjp0cnVlLCJwcm9maWxlUGljdHVyZSI6bnVsbCwiZGV2aWNlc0lEIjpbXSwiX2lkIjoiNWM3YzQ1NTVjZjFiNzczMTAwMzg2NGZkIiwicHJpbWFyeUxhbmd1YWdlIjoiNWM3YzQ1NTVjZjFiNzczMTAwMzg2NGVhIiwicm9sZSI6eyJfaWQiOiI1YzdjNDU1NWNmMWI3NzMxMDAzODY0ZjYiLCJyb2xlcyI6ImFkbWluaXN0cmF0b3IifSwiZnVsbG5hbWUiOiJBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJhZG1pbkB3ZWJ1eGxhYi5jb20iLCJ1cmwiOiJhZG1pbi1hZG1pbiIsIl9fdiI6MCwiaWF0IjoxNTUxNjQ4MDg3LCJleHAiOjE1NTE3MzQ0ODd9.y5pOpKiF1uSeDr88uVVOqUyEJ5oUQPQe36H6UggbQwI","user-agent":"PostmanRuntime/7.6.0","accept":"*/*","host":"127.0.0.1:1337","accept-encoding":"gzip, deflate","content-length":"109","connection":"keep-alive"}',
    "http-version": "1.1",
    "remote-ip": "::ffff:127.0.0.1",
    "remote-user": "-",
    length: "156",
    referrer: "-",
    "user-agent": "PostmanRuntime/7.6.0",
    "accept-language": "-",
    "response-time": "86.003 ms",
    level: "info",
    label: "Test01"
  }
});

webuxlogger.info({
  message: "suopose to work ",
  method: "POST",
  url: "/create",
  status: "201",
  body: {
    notification: {
      deviceID: "5cf0524c29b376c575e6005b",
      message: "Door Open",
      password: "bonjour"
    }
  },
  headers: {
    "content-type": "application/json",
    lang: "es",
    "cache-control": "no-cache",
    "user-agent": "PostmanRuntime/7.6.0",
    authorization: "Bearer 232343tg4r",
    accept: "*/*",
    host: "127.0.0.1:1337",
    "accept-encoding": "gzip, deflate",
    "content-length": "109",
    connection: "keep-alive"
  },
  "http-version": "1.1",
  "remote-ip": "::ffff:127.0.0.1",
  "remote-user": "-",
  length: "156",
  referrer: "-",
  "user-agent": "PostmanRuntime/7.6.0",
  "accept-language": "-",
  "response-time": "86.003 ms",
  level: "info",
  label: "Test01",
  timestamp: "2019-06-22T18:13:06.486Z"
});

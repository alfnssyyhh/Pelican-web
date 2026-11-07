const fs = require("fs");

// Patch callback fs.mkdir
const origMkdir = fs.mkdir;
fs.mkdir = function (p, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  let retries = 15;
  function attempt() {
    origMkdir.call(fs, p, options, (err, res) => {
      if (err && (err.code === "EPERM" || err.code === "EBUSY") && retries > 0) {
        retries--;
        return setTimeout(attempt, 60);
      }
      if (callback) callback(err, res);
    });
  }
  attempt();
};

// Patch sync fs.mkdirSync
const origMkdirSync = fs.mkdirSync;
fs.mkdirSync = function (p, options) {
  let retries = 15;
  while (true) {
    try {
      return origMkdirSync.call(fs, p, options);
    } catch (err) {
      if ((err.code === "EPERM" || err.code === "EBUSY") && retries > 0) {
        retries--;
        const start = Date.now();
        while (Date.now() - start < 60) {}
      } else {
        throw err;
      }
    }
  }
};

// Patch promise fs.promises.mkdir
if (fs.promises && fs.promises.mkdir) {
  const origPromisesMkdir = fs.promises.mkdir;
  fs.promises.mkdir = async function (p, options) {
    let retries = 15;
    while (true) {
      try {
        return await origPromisesMkdir.call(fs.promises, p, options);
      } catch (err) {
        if ((err.code === "EPERM" || err.code === "EBUSY") && retries > 0) {
          retries--;
          await new Promise((r) => setTimeout(r, 60));
        } else {
          throw err;
        }
      }
    }
  };
}

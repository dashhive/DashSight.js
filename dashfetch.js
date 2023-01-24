(function (exports) {
  "use strict";

  /**
   * @type {RequestInit} defaultOpts
   */
  let defaultOpts = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  }

  /**
   * @param {String | URL | Request} url
   * @param {RequestInit} opts
   */
  async function dashfetch(url, opts) {
    opts = Object.assign({}, defaultOpts, opts)
    if (opts.body) {
      opts.body = JSON.stringify(opts.body)
    }

    let resp = await fetch(url, opts);
    if (resp.ok) {
      return resp;
    }

    let err = new Error(
      `http request was ${resp.status}, not ok. See err.response for details.`,
    );
    // @ts-ignore
    err.response = resp.json();
    throw err;
  }

  // @ts-ignore
  exports.__dashsight_fetch = dashfetch;

  if ("undefined" !== typeof module) {
    module.exports = dashfetch;
  }
})(("undefined" !== typeof module && module.exports) || window);

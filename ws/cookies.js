"use strict";

/** @type {import('../').CookieStore} */
let Cookies = module.exports;

let Cookie = require("tough-cookie");
//@ts-ignore TODO
//let FileCookieStore = require("@root/file-cookie-store");
//let cookies_store = new FileCookieStore("./cookie.txt", { auto_sync: false });
let jar = new Cookie.CookieJar(/*cookies_store*/);
//@ts-ignore
jar.setCookieAsync = require("util").promisify(jar.setCookie);
//@ts-ignore
jar.getCookiesAsync = require("util").promisify(jar.getCookies);
//cookies_store.saveAsync = require("util").promisify(cookies_store.save);

/**
 * @param {String} url
 * @param {import('http').IncomingMessage} resp
 * @returns {Promise<void>}
 */
Cookies.set = async function _setCookie(url, resp) {
  /** @type {Array<String>} */
  let cookies;
  let moreCookies = resp.headers["set-cookie"];
  if (!moreCookies) {
    return;
  }

  if (!Array.isArray(moreCookies)) {
    moreCookies = [moreCookies];
  }
  //@ts-ignore
  cookies = moreCookies.map(Cookie.parse);

  // let Cookie = //require('set-cookie-parser');
  // Cookie.parse(resp, { decodeValues: true });
  let ps = cookies.map(async function (cookie) {
    //console.log('DEBUG cookie:', cookie.toJSON());
    let jarOpts = { now: new Date() };
    //@ts-ignore
    await jar.setCookieAsync(cookie, url, jarOpts);
  });

  await Promise.all(ps);
  //await cookies_store.saveAsync();
};

/**
 * @param {String} url
 * @returns {Promise<String>}
 */
Cookies.get = async function _getCookie(url) {
  //@ts-ignore
  let cookieObj = await jar.getCookiesAsync(url);
  let cookieStr = cookieObj.toString();
  return cookieStr;
};

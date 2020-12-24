const express = require('express');
const Promise = require("bluebird");
const router = express.Router();
const path = require('path')
const readFile = Promise.promisify(require("fs").readFile);
const auth = require("../users/auth")

const renderHtml = (req, res) => {
  let pagePath = req.url;
  let reqPage = pagePath.split("/react/")[1]
  let filePath = path.join("ui/pages/" + reqPage + ".html")
  let nav = Tony.Config.nav;
  readFile(filePath, 'utf-8').then(html => {
    res.render('react.hbs', {
      title: nav && nav.sub ? nav.sub.filter((data) => {
        return data.name.toLowerCase() === pagePath;
      }).map((data) => {
        return data.name;
      }) : Tony.Config.project_name,
      nav: nav && nav.sub ? nav.sub : null,
      html: html,
      query: req.query
    });
  }).catch(err => {
    if (err.code === 'ENOENT')
      res.render('404.hbs')
  })
}

getTitle = (nav, pagePath) => {
  if (!nav || !nav.length)
    return ''
  let title = ''
  for (let i = 0; i < nav.length; i++) {
    let n = nav[i]
    if (n.sub && n.sub.length) {
      title = getTitle(n.sub, pagePath)
      break
    } else if (`/app/${Tony.Config.moduleName}/${n.path}` === pagePath) {
      title = n.name
      break
    } else
      title = ''
  }
  return title
}

captailize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

module.exports = router.get('/', (req, res, next) => {
  res.redirect(`${Tony.Config.digInUrl}`)
}).get(`/app/${Tony.Config.moduleName}`, (req, res, next) => {
  res.redirect(`${Tony.Config.digInUrl}`)
}).get(`/${Tony.Config.moduleName}/*`, (req, res, next) => {
  let nav = Tony.Config.nav;
  let pagePath = req.url;
  let reqPage = pagePath.split(`/${Tony.Config.moduleName}/`)[1]
  let title = getTitle(nav, '/app' + pagePath)
  let subTitle = reqPage.split('/').length ? reqPage.split('/')[0] : reqPage
  subTitle = subTitle.includes("?") ? subTitle.substr(0, subTitle.indexOf("?")) : subTitle
  title = nav && title && title.length ? title : subTitle.includes("-") ? subTitle.replace("-", " ") : subTitle
  res.render('react.hbs', {
    title: title ? captailize(title) : captailize(Tony.Config.project_name),
    loggedIn: Tony.Config.dev ? true : auth.isAuthenticated(req),
    username: Tony.Session && Tony.Session.username ? Tony.Session.username : null,
    moduleName: Tony.Config.moduleName,
    nav: nav,
    project: Tony.Config.project_name,
  })
})
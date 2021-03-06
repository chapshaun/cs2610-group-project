var express = require('express');
var request = require('request');
var body_parser = require('body-parser')
var Users = require('../models/users')
var router = express.Router();
var SEARCH_QUERY = ''

router.get('/', function(req, res, next) {
  if (req.session.access_token == null) {
    res.redirect('localhost:3000/')
  } else {

    Users.find(req.session.userId, function(document) {

        if (SEARCH_QUERY == '') {
          res.render('search', {
            title: 'Search',
            feed: {},
            tags: document.tags
          })
        } else {


          var options = {
            url: 'https://api.instagram.com/v1/tags/' + SEARCH_QUERY + '/media/recent?access_token=' + req.session.access_token + '&count=21'

          }

          request.get(options, function(error, response, body) {

            if (error) {
              console.log("error if 1")
              return next(error)
            }
            try {
              var feed = JSON.parse(body)
            } catch (err) {
              console.log("error if 2")
                // return error if what we get back is HTML code
              return next(err) // displays the error on the page
                // return res.reditect('/') // just redirects to homepage
            }

            if (feed.meta.code > 200) {
              console.log("error code above 200")
              return next(feed.meta.error_message)
            }

            res.render('search', {
              title: 'Search',
              feed: feed.data,
              search_query: SEARCH_QUERY,
              tags: document.tags
            })
          })
        }
      })
  }
})

router.post('/', function(req, res) {
  SEARCH_QUERY = req.body.query

  return res.redirect('/search')

})

module.exports = router

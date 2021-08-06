const express = require('express')
const morgan = require('morgan')
var favicon = require('serve-favicon');
const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan('combined'))
app.use((_, resp, next) => {
  resp.set('nel', JSON.stringify({
    'report_to': 'test',
    'max_age': 604800
  }))

  resp.set('report-to', '{"endpoints":[{"url":"https:\\/\\/nel-reports.herokuapp.com\\/report"}],"group":"test","max_age":604800,"include_subdomains":true}')
//  resp.set('report-to', JSON.stringify({
//    "endpoints": [{"url":"https://nel-reports.herokuapp.com/report"}],
//    "group":"default",
//    "max_age":604800,
//    "include_subdomains":true
//  }))
  next()
})

app.get('/', function(req, res){
  res.send('Hello World');
});

app.use(express.static('public'))

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(function(req, res, next){
    res.status(404);

    res.format({
          html: function () {
                  res.render('404', { url: req.url })
                },
          json: function () {
                  res.json({ error: 'Not found' })
                },
          default: function () {
                  res.type('txt').send('Not found')
                }
        })
});

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

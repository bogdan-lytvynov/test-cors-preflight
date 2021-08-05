const express = require('express')
const morgan = require('morgan')
var favicon = require('serve-favicon');
const app = express()
const PORT = process.env.PORT || 3001

app.use(morgan('combined'))
app.use((_, resp, next) => {
  resp.set('nel', JSON.stringify({
    'report_to': 'default',
    'max_age': 604800
  }))

  resp.set('report-to', JSON.stringify({
    "endpoints": [{"url":"https://nel-reports.herokuapp.com/report"}],
    "group":"default",
    "max_age":604800,
    "include_subdomains":true
  }))
  next()
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  return res.sendfile('/public/index.html');
})

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
  res.render('500', { error: err });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

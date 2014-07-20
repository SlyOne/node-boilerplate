var express     = require('express')
  , routes      = require('./router')
  , nunjucks    = require('nunjucks')
  , http        = require('http')
  , path        = require('path');

var app         = express();

//nunjucks setup
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/views'), { 
    dev: true, 
    autoescape: true 
});

env.addFilter('shorten', function(str, count) {
  if(str.length > count) {
    return str.slice(0, count)+'...';
  } else {
    return str;
  }
});

env.addFilter('json', function(data) {
  return JSON.stringify(data);
});

env.addFilter('date', function(date){
  return moment(date).format('MM/DD h:mma')
})
//

app.configure(function(){
  app.set('views', __dirname + '/views');
  // app.set('view engine', 'ejs');
  
  //feed app to nunjucks environment
  env.express(app);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());


  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// routes to serve the static HTML files
app.get('/contact', function(req, res) {
    res.sendfile(html_dir + 'contact.html');
});
// Note: route names need not match the file name
app.get('/hello', function(req, res) {
    res.sendfile(html_dir + 'hello.html');
});

//nunjucks
var itemsList = [
      { name : 'item #11', price: '$1202' },
      { name : 'item #21', price: '$1229' },
      { name : 'item #31', price: '$1249' },
      { name : 'item #41', price: '$1253' },
    ]

app.get('/index2', function(req, res) {
  // console.log("booo")
  res.render('index2.html', {
            title : 'Nunjucks Page',
            items : itemsList
  });
});



// Connect mongoose
var options = {};
// var mongo = require('./db/mongo-store');
// mongo(options);

// Setup routes
routes(app, options);

http.createServer(app).listen(3000, function(){
  console.log("Express server listening");
});

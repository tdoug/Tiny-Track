var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;
var moment = require('moment');
var mongoose = require('mongoose');
var flash    = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/dtracker');

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.cookieSession({secret:"thisisadiettrackersecret"}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.logger());
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


///my modules
var log_entries = require('./routes/log_entries');

///models
var schema = require('./models/schema.js');

///controllers
require('./controllers/passport.js')(passport);


///routes

///if the user is not logged in, redirect
app.get('/', isLoggedIn, function(req, res){
  res.redirect('/log');
});

app.get('/auth/login', function(req, res) {
	var this_title = 'Tiny Track - Login';
	res.render('login.jade', {title:this_title});
});

app.get('/auth/register', function(req, res){
   res.render('register.jade', { message: req.flash('signupMessage') });
});

app.get('/log', isLoggedIn, function(req,res) {
  var this_today = moment().format("MM/DD/YY");
  var this_title = 'Tiny Track - Food Log';
  var d = new Date();
  var this_timestamp = d.getTime();
  res.render('log.jade', {title:this_title, start_date:this_today, timestamp:this_timestamp});
});

app.post('/auth/register', passport.authenticate('local-signup', {
    successRedirect : '/auth/login', // redirect to the log
    failureRedirect : '/auth/register', // redirect back to the signup page if there is an error
    failureFlash : true // allows flash messages
  }));

app.post('/auth/login', passport.authenticate('local-login', {
    successRedirect : '/log', 
    failureRedirect : '/auth/login', 
    failureFlash : true 
  }));

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


///route for entries CRUD
app.post('/log_entries', log_entries.save, log_entries.del, function(res, req)
{
    
});

//route for AJAX creation of results
app.get('/log_data', function(req,res)
{
  var yesterday = req.query.food_date - (24 * 60 * 60 * 1000);
  
  console.log(yesterday);
  console.log(req.user._id);
   schema.log_entry.find({user_id:req.user._id, date:{ $gt:yesterday }}).lean().exec(function (err, this_log_entries)
   {

    ///cycle through results and tabulate totals for each nutrient
    var this_totals = {calories:0, fat:0, carbs:0, protein:0};
    
    Object.keys(this_log_entries).forEach(function(key) {
      this_totals.calories = this_totals.calories + this_log_entries[key].calories;
      this_totals.fat = this_totals.fat + this_log_entries[key].fat;
      this_totals.carbs = this_totals.carbs + this_log_entries[key].carbs;
      this_totals.protein = this_totals.protein + this_log_entries[key].protein;
    });
      res.render('log_data.jade', {log_entries:this_log_entries, totals:this_totals});
    });
});

var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/auth/login');
}

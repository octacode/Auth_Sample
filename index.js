var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./models/user.js');

mongoose.connect("mongodb://localhost/auth_demo_app",{
  useMongoClient: true
});

app.use(require("express-session")({
  secret: "Trust me it's Nvidea in here.",
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}

// ==========================================
// ROUTES
// ==========================================
app.get('/', (req,res)=>{
  res.render('home');
});

app.get('/secret', isLoggedIn,(req,res)=>{
  res.render('secret');
});


// ===========================================
// AUTH ROUTES
// ===========================================
app.get('/register', (req,res)=>{
    res.render('register');
});

app.post('/register', (req,res)=>{
  User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
     if(!err){
       passport.authenticate('local')(req, res, ()=>{
         res.redirect('/secret');
       })
     }
  });
});

app.get('/login', (req,res)=>{
  res.render("login");
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }), (req, res)=>{
});

app.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
});

app.listen(1313, (err)=>{
  if(err)
    console.log(err);
  else
    console.log("Server sunn rha hai");
})

var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');


//user can login, user can use our local strategy
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index');
});

//profile route
router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});

router.post('/register',function(req,res){
  var userData = new userModel({
    username:req.body.username,
    secret: req.body.secret
  });

  //creating user Account
  userModel.register(userData, req.body.password)
  .then(function(registeredUser){
    //successfully login as soon as account is created
    passport.authenticate("local")(req,res, function(){
      //and user went to /profile route
      res.redirect('/profile');
    })
  })
});


//login route
//passport.authenticate is middleware here...
router.post('/login', passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect:"/"
}), function(req,res){ })


//logout route
router.get("/logout", function(req,res,next){
  req.logout(function(err){
    if (err) return next (err);
    res.redirect("/")
  })
});


//protection
function isLoggedIn(req,res,next){
  //if you are logged in then move forward otherwise redirect to "/"
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


module.exports = router;

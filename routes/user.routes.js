const router = require("express").Router();

const User = require("../models/User.model")
// const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lab-express-basic-auth";

const bcrypt = require("bcryptjs");
const saltRounds = 10;

const isLoggedIn = require("../middlewares/isLoggedIn")
const isLoggedOut = require("../middlewares/isLoggedOut")


/* GET home page */
router.get("/", (req, res, next) =>{
  res.render("index", {title: "Home Page"})
})

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("user/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  let {username, password, passwordRepeat} = req.body ;
  if(username == "" || password == "" || passwordRepeat == ""){
    res.render("user/signup", {mensajeError: "Falta rellenar campos"})
    return;
  }
  else if(password != passwordRepeat){
    res.render("user/signup", {mensajeError: "Las contraseñas no coinciden"})
    return;
  }
  User.find({username})
  .then(result =>{
    if(result.length != 0) {
      res.render("user/signup", {mensajeError: "Usuario ya existe"})
      return;
    } 
    let salt = bcrypt.genSaltSync(saltRounds);
    let passwordEncriptado = bcrypt.hashSync(password, salt);

    User.create({
      username: username,
      password: passwordEncriptado
    })
    .then(result=>{
      res.redirect("/user/login")
    })
    .catch(err=>next(err))
  })
  .catch(err => next(err))
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("user/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  let {username, password} = req.body;
  if(username == "" || password == ""){
    res.render("user/login", {mensajeError: "Campos vacíos"})
    return;
  }
  User.find({username})
  .then(result =>{
    if(result.length == 0){
      res.render("user/login", {mensajeError: "Credenciales incorrectas"})
      return;
    }
    if(bcrypt.compareSync(password, result[0].password)) {
      req.session.currentUser = username; //en req.session.currentUser guardamos la información del usuario que nos interese. Podemos guardar un string o un objeto con todos los datos
      res.redirect("/user/profile");
    } else {
      res.render("users/login", { mensajeError: "Credenciales incorrectas" });
    }
  })
  .catch(err => next(err));
  })

  router.get("/profile", (req, res, next) => {
    res.render("user/profile");
  });

router.get("/main", isLoggedOut, (req, res, next) =>{
  res.render("user/main")
})

router.get("/private", isLoggedIn, (req, res, next) =>{
  res.render("user/private")
})

router.get("/logout", isLoggedIn, (req, res, next)=>{
  req.session.destroy(err => {
    if(err) next(err);
    else res.redirect("/user/login");
  });
});
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err);
    } else {
      res.redirect('/');
    }
  });
});
module.exports = router;


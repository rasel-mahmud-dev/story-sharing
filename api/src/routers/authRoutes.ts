
import passport from "passport"
import controllers from "../controllers"
import getAuthID from "../middlewares/getAuthID";
import response from "../response";

export default (app)=>{
  app.get("/api/auth/user/:email", controllers.authController.getUserEmail)

  app.post("/api/auth/login", controllers.authController.loginUser)
  app.get("/api/users/:id", controllers.authController.getUser)
  
  app.post("/api/auth/users", getAuthID, controllers.authController.getUsers)

  app.get("/api/auth/current-auth", controllers.authController.loginViaToken)
  app.post("/api/auth/register", controllers.authController.createNewUser)

  app.post("/api/add-cookie", controllers.authController.cookieAdd)


  // app.get('/auth/callback/google', passport.authenticate('google'), function(req, res) {
  //   if(req.user){
  //     let queryParams = ''
  //     for (let userKey in req.user) {
  //       if(req.user[userKey]) {
  //         queryParams = queryParams + "&" + userKey + "=" + req.user[userKey]
  //       }
  //     }
  //     let q = queryParams.slice(1)
  //
  //     // res.redirect(`${process.env.NODE_ENV === "development" ? "http://localhost:5500/#" : "https://rsl-my-blog.netlify.app/#"}/auth/callback/google?${q}`)
  //     res.redirect(`https://rsl-my-blog.netlify.app/#/auth/callback/google?${q}`)
  //     req.user = {
  //       id: req.user._id,
  //       email: req.user.email
  //     }
  //   } else {
  //     response(res, 500, "Internal Error")
  //   }
  //   // Successful authentication, redirect home.
  // });
  
  // app.get('/auth/callback/facebook',  passport.authenticate('facebook'),  function(req, res) {
  //   if(req.user){
  //     let queryParams = ''
  //     for (let userKey in req.user) {
  //       if(req.user[userKey]) {
  //         queryParams = queryParams + "&" + userKey + "=" + req.user[userKey]
  //       }
  //     }
  //     let q = queryParams.slice(1)
  //     res.redirect(`${process.env.NODE_ENV === "development" ? "http://localhost:5500/#" : "https://rsl-my-blog.netlify.app/#"}/auth/callback/facebook?${q}`)
  //     // res.redirect(`http://localhost:5500/#/auth/callback/facebook?${q}`)
  //     req.user = {
  //       id: req.user._id,
  //       email: req.user.email
  //     }
  //   } else {
  //     response(res, 500, "Internal Error")
  //   }
  //   // Successful authentication, redirect home.
  //
  //   });


  app.post("/api/upload-profile-photo", getAuthID, controllers.authController.uploadProfilePhoto)
  app.post("/api/upload-profile-cover-photo", getAuthID, controllers.authController.uploadProfileCoverPhoto)

  app.post("/api/upload-markdown-image", getAuthID, controllers.authController.uploadMarkdownImage)

  app.post("/api/update-profile", getAuthID, controllers.authController.updateProfile)

  app.get("/api/get-auth-password", getAuthID, controllers.authController.getAuthPassword)

  app.post("/api/auth/send/mail", controllers.authController.sendPasswordResetMail)

  app.post("/api/auth/password-reset-session-check", controllers.authController.checkPasswordResetSessionTimeout)


  app.post("/api/auth/reset-password", controllers.authController.changePassword)
  
  
  app.get('/auth/callback/google',  function(req, res) {
    passport.authenticate('google', function(err, user) {
      if(err){
        response(res, 500, "Login fail")
        return
      } else {
        let queryParams = ''
        for (let userKey in user) {
          if(user[userKey]) {
            queryParams = queryParams + "&" + userKey + "=" + user[userKey]
          }
        }
        let q = queryParams.slice(1)
        const origin = process.env.FRONTEND + "/#"
        res.redirect(`${origin}/auth/callback/google?${q}`)
        req.user = {
          id: user._id,
          email: user.email
        }
      }
      
    })(req, res);
    // Successful authentication, redirect home.
    
  });
  
  app.get('/auth/callback/facebook', function(req, res) {
    passport.authenticate('facebook', function(err, user) {
      if(err){
        response(res, 500, "Login fail")
        return
      } else {
        let queryParams = ''
        for (let userKey in user) {
          if(user[userKey]) {
            queryParams = queryParams + "&" + userKey + "=" + user[userKey]
          }
        }
        let q = queryParams.slice(1)
        const origin = process.env.FRONTEND + "/#"
        res.redirect(`${origin}/auth/callback/facebook?${q}`)
        req.user = {
          id: user._id,
          email: user.email
        }
      }

    })(req, res);
  });
  
  app.get('/api/auth/social/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/api/auth/social/login/facebook', passport.authenticate('facebook'));
  

}
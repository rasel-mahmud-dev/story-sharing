
import postRoutes from "./postRoutes"
import authRoutes from "./authRoutes";
// import filesRoutes from "./filesRoutes";
import appAdminRoutes from "./appAdminRoutes";


function routes (app){
  
  app.get("/", (req, res)=>{
    res.send("Hello")
  })
  postRoutes(app)
  authRoutes(app)
  // filesRoutes(app)
  appAdminRoutes(app)
}


export default routes


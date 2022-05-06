

import  controllers from "../controllers"
import {isAdmin} from "../middlewares/isAuth";
import {getPortfolioTopPosts} from "../controllers/appAdminController";


export default (app)=>{
  // app.get("/", controllers.appAdminController.getHomePage)
  app.post("/admin/login", controllers.appAdminController.adminLogin)
  app.post("/admin/upload/file", controllers.appAdminController.uploadDatabaseFile)
  // app.get("/api/auth/current-auth", controllers.default.loginViaToken)


  app.post("/api/admin/get-server-logs", isAdmin, controllers.appAdminController.getServerLogs)
  app.post("/api/admin/get-server-log", isAdmin, controllers.appAdminController.getServerLog)
  app.post("/api/admin/delete-server-log", isAdmin, controllers.appAdminController.deleteServerLog)
  
  app.post("/api/admin/portfolio-posts", isAdmin, controllers.appAdminController.getPortfolioPosts)
  app.post("/api/admin/portfolio-top-posts", isAdmin, controllers.appAdminController.getPortfolioTopPosts)
  
  app.post("/api/admin/add-portfolio-top-post", isAdmin, controllers.appAdminController.addPortfolioTopPosts)
  app.post("/api/admin/remove-portfolio-top-post", isAdmin, controllers.appAdminController.removePortfolioTopPosts)
  
  app.post("/api/admin/add-portfolio-all-post", isAdmin, controllers.appAdminController.addPortfolioAllPosts)
  app.post("/api/admin/remove-portfolio-all-post", isAdmin, controllers.appAdminController.removePortfolioAllPosts)

}



import controllers from "../controllers"
import getAuthID from "../middlewares/getAuthID";

export default (app)=>{
  
  app.get("/api/files", getAuthID, controllers.filesController.getMarkDownFileList)
  app.get("/api/get-file-content", getAuthID, controllers.filesController.getFileContent)
  app.post("/api/save-file-content", getAuthID, controllers.filesController.saveFileContent)

  app.post("/api/file-upload", getAuthID, controllers.filesController.uploadFile)



  // app.get("/api/backup", getAuthID, controllers.filesController.makeDataBackup)


  app.post("/api/file-delete", getAuthID, controllers.filesController.deletedFile)
  
  // app.post("/api/sync-md", getAuthID, controllers.filesController.syncMarkdownFileToDrive)

}
import express, { Request, Response } from "express";
const serverless = require('serverless-http');
const app = express();
const cors = require("cors")
const bodyParser = require('body-parser');


require("dotenv").config()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.disable('x-powered-by');

const whitelist = [process.env.FRONTEND]
const corsOptions = {
	credentials: true,
	origin: function (origin: any, callback: any) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true)
		} else {
			if(process.env.NODE_ENV === "development"){
				callback(null, true) // anyone can access this apis when is development mode
			} else {
				callback(null, {origin: false }) // anyone can access this apis
				// callback(new Error('Not allowed by CORS'))
			}
		}
	}
}

app.use(cors(corsOptions))

const router = express.Router();


if(process.env.NODE_ENV === "development") {
	const mainApp = require("../src/app")
	mainApp(app)

// 	app.use("/products/", express.static(path.resolve("src/static/products/")))
// 	app.use("/avatar/", express.static(path.resolve("src/static/avatar/")))
//
// } else {
// 	/**
//     When out app are build
// 	 */
// 	const mainApp = require("../dist")
//
//
// 	/*? fixed later */
// 	app.use("/products/", express.static(path.resolve("dist/static/products/")))
// 	app.use("/avatar/", express.static(path.resolve("dist/static/avatar/")))
//
// 	router.use("/products/", express.static(path.resolve("dist/static/products/")))
// 	router.use("/avatar/", express.static(path.resolve("dist/static/avatar/")))
//

} else {
	const mainApp = require("../src/app")
	mainApp.default(router).then((r: any) => {}).catch((ex: any)=>{})
}

	
	app.get("/", function (req: Request, res: Response){
		res.send("with app v3")
	})
	
	// /.netlify/functions
	router.get("/", function (req: Request, res: Response){
		res.send("router app v3")
	})
	
	
	// for direct access /.netlify/functions/server/api/brand2
	// router.get("/api/brand2", function (req, res){
	//   res.send(req.url)
	// })
// }


// access if from  /.netlify/functions/server
//   router.get("/", (r, res)=>{
//     res.send("hi")
//   })

// access if from          /
//   app.get("/", (r, res)=>{
//     res.send("ap")
// })



app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);  // path must route to lambda



module.exports = app;
module.exports.handler = serverless(app);


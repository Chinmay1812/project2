import express, { json, urlencoded } from "express";
const app = express();
import dbconnect from "./config/db.js";
import cors from "cors";
import {errorHandler} from "./middlewares/errorMiddleware.js";
import { DEV_MODE, PORT } from "./config/constants.js";
//routes
import taskRoutes from './routes/taskRoutes.js'
import userRoutes from './routes/userRoutes.js'



// middlewares
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

if(DEV_MODE) app.use((req, res, next) => {
  console.log(`[ ${req.method} ] : ${req.url}`);
  next();
});
// init
dbconnect();
app.get("/", (req, res) => {
  res.send("Server Running");
});

//routes
app.use('/api/',userRoutes);
app.use('/api/',taskRoutes)



app.use(errorHandler);


//middlewares
const port = PORT;
app.listen(port, () =>
    console.log(`Server started at port 'http://localhost:${port}'`)
);
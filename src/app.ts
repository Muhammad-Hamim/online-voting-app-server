import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
const app = express();

//parsers
app.use(express.json());
app.use(cors());

//router
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//global error handler
app.use(globalErrorHandler);
//not found

export default app;

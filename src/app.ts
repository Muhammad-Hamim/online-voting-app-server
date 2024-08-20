import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";

const app = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://online-voting-app-client.vercel.app"
    ],
    credentials: true,
  })
);


//router
app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//global error handler
app.use(globalErrorHandler);
//not found

export default app;

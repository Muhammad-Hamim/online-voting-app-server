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
      "https://online-voting-app.netlify.app",
      "https://online-voting-app-client.vercel.app",
      "http://localhost:5173",
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

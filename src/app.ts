import express from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";
import { PositionServices } from "./app/Models/position/position.services";

const app = express();

//parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
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

// Start the function that periodically updates statuses
let isUpdating = false;

setInterval(async () => {
  if (isUpdating) return;

  isUpdating = true;
  try {
    await PositionServices.updatePositionStatuses();
  } catch (error) {
    console.error("Error updating position statuses:", error);
  } finally {
    isUpdating = false;
  }
}, 60 * 1000);

export default app;

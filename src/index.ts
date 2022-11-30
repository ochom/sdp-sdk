import express, { NextFunction, Request, Response } from "express";

import Handler from "./handlers";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const h = new Handler();

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  axios.get("https://curlmyip.org").then((response) => {
    res.send(`We are liv at: ${response.data}`);
  });
});

// define authenticated groups
const auth = express.Router();
auth.use((req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-api-key"];
  const accessToken = process.env.ACCESS_TOKEN;
  if (token !== accessToken) {
    return res.status(401).send("Unauthorized");
  }
  next();
});

// subscription
auth.post("/subscription/activate", h.subscribe);
auth.post("/subscription/deactivate", h.unSubscribe);

// send sms
auth.post("/sms/send-bulk", h.handleBulk);
auth.post("/sms/send-premium", h.handlePremium);

// use the router and 401 anything falling through
app.use("/api", auth);

// start the Express server
const PORT = parseInt(process.env.PORT || "8080");
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

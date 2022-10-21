import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { handleBulk, handlePremium } from "./handlers/sms";
import {
  handleActivateSubscription,
  handleDeactivateSubscription,
} from "./handlers/subscription";

const app = express();
app.use(bodyParser.json());

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  res.send("We are live! <a href='/docs'>Docs</a>");
});

// define authenticated groups
const auth = express.Router();
auth.use((req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (token !== process.env.ACCESS_TOKEN) {
    return res.status(401).send("Unauthorized");
  }
  next();
});

// subscription
auth.post("/subscription/activate", handleActivateSubscription);
auth.post("/subscription/deactivate", handleDeactivateSubscription);

// send sms
auth.post("/sms/send-bulk", handleBulk);
auth.post("/sms/send-premium", handlePremium);

// use the router and 401 anything falling through
app.use("/api", auth);

// start the Express server
const port = 8080;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { handleBulk, handlePremium } from "./handlers/sms";
import {
  handleActivateSubscription,
  handleDeactivateSubscription,
} from "./handlers/subscription";

import swaggerDocument from "../swagger.json";

const app = express();
app.use(bodyParser.json());

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
  res.send("We are live! <a href='/docs'>Docs</a>");
});

// define documentation route
app.get(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

// define authenticated groups
const auth = express.Router();
auth.use((req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (username && password) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
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
  console.log(`server started at http://localhost:${port}`);
});

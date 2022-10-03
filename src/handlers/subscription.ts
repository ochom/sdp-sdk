import { Request, Response } from "express";
import SDP from "../controllers/sdp";
import Subscription from "../controllers/subscription";

export async function handleActivateSubscription(req: Request, res: Response) {
  const { username, password, cpID, requestID, offerCode, phoneNumber } =
    req.body;

  const sdp = new SDP(username, password, cpID);
  await sdp.init();

  const subs = new Subscription(sdp);
  const response = await subs.activate(requestID, offerCode, phoneNumber);
  res.send(response);
}

export async function handleDeactivateSubscription(
  req: Request,
  res: Response
) {
  const { username, password, cpID, requestID, offerCode, phoneNumber } =
    req.body;

  const sdp = new SDP(username, password, cpID);
  await sdp.init();

  const subs = new Subscription(sdp);
  const response = await subs.deactivate(requestID, offerCode, phoneNumber);
  res.send(response);
}

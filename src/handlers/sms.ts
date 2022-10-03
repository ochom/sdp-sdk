import { Request, Response } from "express";
import Bulk from "../controllers/bulk";
import Premium from "../controllers/premium";
import SDP from "../controllers/sdp";

export async function handleBulk(req: Request, res: Response) {
  const {
    username,
    password,
    cpID,
    partnerUsername,
    packageID,
    requestID,
    recipients,
    message,
    originAddress,
    callbackURL,
  } = req.body;

  const sdp = new SDP(username, password, cpID);
  await sdp.init();

  const bulk = new Bulk(sdp);
  const response = await bulk.sendSMS(
    requestID,
    partnerUsername,
    packageID,
    originAddress,
    recipients,
    message,
    callbackURL
  );
  res.send(response);
}

export async function handlePremium(req: Request, res: Response) {
  const {
    username,
    password,
    cpID,
    requestID,
    offerCode,
    recipient,
    message,
    LinkId,
  } = req.body;

  const sdp = new SDP(username, password, cpID);
  await sdp.init();

  const prem = new Premium(sdp);
  const response = await prem.sendSMS(
    requestID,
    offerCode,
    recipient,
    message,
    LinkId
  );
  res.send(response);
}

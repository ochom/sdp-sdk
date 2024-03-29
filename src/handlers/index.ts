import { Request, Response } from "express";

import Bulk from "../controllers/bulk";
import MyToken from "../utils/token";
import Premium from "../controllers/premium";
import SDP from "../controllers/sdp";
import Subscription from "../controllers/subscription";

export default class Handler {
  token: MyToken;

  constructor() {
    this.token = new MyToken();
  }

  handleBulk = async (req: Request, res: Response) => {
    try {
      const {
        username,
        password,
        cpID,
        cpName,
        senderID,
        requestID,
        recipient,
        message,
        callbackURL,
      } = req.body;

      const sdp = new SDP(this.token, username, password, cpID);
      await sdp.init();

      const bulk = new Bulk(sdp);
      const response = await bulk.sendSMS(
        requestID,
        cpName,
        senderID,
        recipient,
        message,
        callbackURL
      );
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  handlePremium = async (req: Request, res: Response) => {
    try {
      const {
        username,
        password,
        cpID,
        requestID,
        offerCode,
        recipient,
        message,
        LinkID,
      } = req.body;

      const sdp = new SDP(this.token, username, password, cpID);
      await sdp.init();

      const prem = new Premium(sdp);
      const response = await prem.sendSMS(
        requestID,
        offerCode,
        recipient,
        message,
        LinkID
      );
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  subscribe = async (req: Request, res: Response) => {
    try {
      const { username, password, cpID, requestID, offerCode, phoneNumber } =
        req.body;

      const sdp = new SDP(this.token, username, password, cpID);
      await sdp.init();

      const subs = new Subscription(sdp);
      const response = await subs.activate(requestID, offerCode, phoneNumber);
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  unSubscribe = async (req: Request, res: Response) => {
    try {
      const { username, password, cpID, requestID, offerCode, phoneNumber } =
        req.body;

      const sdp = new SDP(this.token, username, password, cpID);
      await sdp.init();

      const subs = new Subscription(sdp);
      const response = await subs.deactivate(requestID, offerCode, phoneNumber);
      res.send(response);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
}

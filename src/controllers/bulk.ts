import { Response } from "../utils";
import SDP from "./sdp";

export default class Bulk {
  sdp: SDP;

  constructor(sdp: SDP) {
    this.sdp = sdp;
  }

  async sendSMS(
    requestID: string,
    cpName: string,
    packageID: string,
    senderID: string,
    recipient: string,
    message: string,
    callbackURL: string
  ): Promise<Response> {
    const timeStamp = Date.now();

    const uniqueId = requestID;
    const userName = cpName;
    const channel = "sms";
    // const packageId = parseInt(packageID || "0");
    const oa = senderID; // oa is short for originAddress e.g TestSender
    const msisdn = recipient;
    const actionResponseURL = callbackURL;

    const body = {
      timeStamp, // this.sdp.generateTimestamp(),
      dataSet: [
        {
          uniqueId,
          userName,
          channel,
          oa,
          msisdn,
          message,
          actionResponseURL,
        },
      ],
    };

    // // if not in production mode, delete packageID from body
    // if (this.sdp.deploymentMode !== "production") {
    //   delete body.dataSet[0].packageId;
    // }

    const headers = {
      "X-Authorization": `Bearer ${this.sdp.accessToken}`,
    };

    const response = await this.sdp.request.send(
      "POST",
      "public/CMS/bulksms",
      body,
      headers
    );

    return response;
  }
}

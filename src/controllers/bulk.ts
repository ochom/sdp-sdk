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
    senderID: string,
    recipient: string,
    message: string,
    callbackURL: string
  ): Promise<Response> {
    const timeStamp = Date.now();

    const uniqueId = requestID;
    const userName = cpName;
    const channel = "sms";
    const oa = senderID;
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

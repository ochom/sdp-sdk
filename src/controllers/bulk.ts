import { Response } from "../utils";
import SDP from "./sdp";

export default class Bulk {
  sdp: SDP;

  constructor(sdp: SDP) {
    this.sdp = sdp;
  }

  async sendSMS(
    requestID: string,
    userName: string,
    packageID: string,
    originAddress: string,
    recipients: string[],
    message: string,
    callbackURL: string
  ): Promise<Response> {
    const body = {
      timeStamp: this.sdp.generateTimestamp(),
      dataSet: {
        channel: "sms",
        uniqueId: requestID,
        userName,
        packageId: packageID,
        oa: originAddress,
        msisdn: recipients,
        message,
        actionResponseURL: callbackURL,
      },
    };

    const headers = { "X-Authorization": this.sdp.token };
    const response = await this.sdp.request.send(
      "POST",
      "public/CMS/bulksms",
      body,
      headers
    );

    return response;
  }
}

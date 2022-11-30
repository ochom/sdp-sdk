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
      dataSet: [
        {
          userName,
          channel: "sms",
          packageId: packageID,
          oa: originAddress, // oa is short for originAddress e.g TestSender
          msisdn: recipients.join(","),
          message,
          uniqueId: requestID,
          actionResponseURL: callbackURL,
        },
      ],
    };

    const headers = {
      "X-Authorization": `Bearer ${this.sdp.token}`,
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

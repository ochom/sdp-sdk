import { Response } from "../utils";
import SDP from "./sdp";
import md5 from "md5";

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
    callbackURL: string,
    cpPassword: string
  ): Promise<Response> {
    const timeStamp = Date.now();

    cpPassword = this.sdp.cpID + cpPassword + timeStamp;
    cpPassword = md5(cpPassword);

    const body = {
      timeStamp: Date.now(), // this.sdp.generateTimestamp(),
      dataSet: [
        {
          userName,
          channel: "sms",
          packageId: parseInt(packageID || "0"),
          oa: originAddress, // oa is short for originAddress e.g TestSender
          msisdn: recipients.join(","),
          message,
          uniqueId: requestID,
          actionResponseURL: callbackURL,
          cpPassword,
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

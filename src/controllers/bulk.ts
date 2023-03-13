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
    msisdn: string,
    message: string,
    actionResponseURL: string,
  ): Promise<Response> {
    const timeStamp = Date.now();

    const uniqueId = requestID;
    const channel = "sms";
    const packageId = parseInt(packageID || "0");
    const oa = originAddress; // oa is short for originAddress e.g TestSender
    const cpPassword = md5(`${this.sdp.cpID}${timeStamp}`); // cpPassword is short for content provider password

    const body = {
      timeStamp, // this.sdp.generateTimestamp(),
      dataSet: [
        {
          uniqueId,
          userName,
          channel,
          packageId,
          oa,
          msisdn,
          message,
          actionResponseURL,
          cpPassword,
        },
      ],
    };

    // if not in production mode, delete packageID from body
    if (this.sdp.deploymentMode !== "production") {
      delete body.dataSet[0].packageId;
    }

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

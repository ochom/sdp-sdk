import { Response } from "../utils";
import SDP from "./sdp";

export default class Premium {
  sdp: SDP;

  constructor(sdp: SDP) {
    this.sdp = sdp;
  }

  async sendSMS(
    requestId: string,
    offerCode: string,
    phoneNumber: string,
    message: string,
    linkId: string = ""
  ): Promise<Response> {
    const data = [
      {
        name: "Msisdn",
        value: phoneNumber,
      },
      {
        name: "Content",
        value: message,
      },
      {
        name: "OfferCode",
        value: offerCode,
      },
      {
        name: "CpId",
        value: this.sdp.cpID,
      },
    ];

    if (linkId) {
      data.push({
        name: "LinkId",
        value: linkId,
      });
    }

    const body = {
      requestId,
      operation: "SendSMS",
      channel: "APIGW",
      requestParam: {
        data,
      },
    };

    const headers = {
      "X-Authorization": `Bearer ${this.sdp.accessToken}`,
    };

    const response = await this.sdp.request.send(
      "POST",
      "public/SDP/sendSMSRequest",
      body,
      headers
    );

    return response;
  }
}

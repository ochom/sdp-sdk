import { Response } from "../utils";
import SDP from "./sdp";

export default class Subscription {
  sdp: SDP;

  constructor(sdp: SDP) {
    this.sdp = sdp;
  }

  activate = async (
    requestID: string,
    offerCode: string,
    phoneNumber: string
  ): Promise<Response> => {
    const body = {
      requestId: requestID,
      requestTimeStamp: Date.now(), // this.sdp.generateTimestamp(),
      channel: "SMS",
      operation: "ACTIVATE",

      requestParam: {
        data: [
          {
            name: "OfferCode",
            value: offerCode,
          },
          {
            name: "Msisdn",
            value: phoneNumber,
          },
          {
            name: "Language",
            value: "1",
          },
          {
            name: "CpId",
            value: this.sdp.cpID,
          },
        ],
      },
    };

    const headers = {
      "X-Authorization": `Bearer ${this.sdp.accessToken}`,
    };

    const response = await this.sdp.request.send(
      "POST",
      "public/SDP/activate",
      body,
      headers
    );

    return response;
  };

  deactivate = async (
    requestID: string,
    offerCode: string,
    phoneNumber: string
  ): Promise<Response> => {
    const body = {
      requestId: requestID,
      requestTimeStamp: Date.now(), // this.sdp.generateTimestamp(),
      channel: "3",
      operation: "DEACTIVATE",

      requestParam: {
        data: [
          {
            name: "OfferCode",
            value: offerCode,
          },
          {
            name: "Msisdn",
            value: phoneNumber,
          },
          {
            name: "CpId",
            value: this.sdp.cpID,
          },
        ],
      },
    };

    const headers = {
      "X-Authorization": `Bearer ${this.sdp.accessToken}`,
    };
    const response = await this.sdp.request.send(
      "POST",
      "public/SDP/deactivate",
      body,
      headers
    );

    return response;
  };
}

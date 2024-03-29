import axios, { AxiosError } from "axios";
// import https from "https";
// import fs from "fs";

export type DeploymentMode = "production" | "development";

const devURL = "https://dtsvc.safaricom.com:8480/api/";
const prodURL = "https://dsvc.safaricom.com:9480/api/";

export interface Response {
  success?: boolean;
  statusCode?: number;
  statusText?: string;
  responseBody?: any;
}

const catchError = (error: AxiosError): Response => {
  const response: Response = {};
  if (error.response) {
    response.success = false;
    response.statusCode = error.response.status;
    response.statusText = error.response.statusText;
    response.responseBody = error.response.data;
  } else if (error.request) {
    response.success = false;
    response.statusCode = 500;
    response.statusText = "Network Error";
    response.responseBody = "Network Error"
  } else {
    response.success = false;
    response.statusCode = 500;
    response.statusText = "Unknown Error";
    response.responseBody = error.message;
  }
  return response;
};

export class Request {
  baseURL: string;
  headers: any = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  constructor(deploymentMode: DeploymentMode) {
    this.baseURL = devURL;
    if (deploymentMode === "production") {
      this.baseURL = prodURL;
    }
  }

  async send(
    method: string,
    url: string,
    data: any,
    headers: any
  ): Promise<Response> {
    let response: Response = {};
    headers = { ...this.headers, ...headers };
    url = `${this.baseURL}${url}`;

    try {
      // const httpsAgent = new https.Agent({
      //   rejectUnauthorized: false,
      //   cert: fs.readFileSync("/app/ssl/cert.pem"),
      //   key: fs.readFileSync("/app/ssl/key.pem"),
      //   passphrase: "password",
      // });

      const res = await axios({
        method,
        url,
        data,
        headers,
        // httpsAgent,
      });
      response.success = true;
      response.statusCode = res.status;
      response.statusText = res.statusText;
      response.responseBody = res.data;
    } catch (error) {
      console.log("Request: ", JSON.stringify({ url, method, data, headers }));
      console.log("Error: ", error);
      response = catchError(error);
    }

    return response;
  }
}

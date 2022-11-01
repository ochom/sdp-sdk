import axios from "axios";

export interface Response {
  success: boolean;
  statusCode: number;
  statusText: string;
  responseBody: any;
  errorCode: number;
  errorMessage: string;
}

export class Request {
  baseURL: string;
  headers: any = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async send(
    method: string,
    url: string,
    data: any,
    headers: any
  ): Promise<Response> {
    try {
      headers = { ...this.headers, ...headers };
      const response = await axios({
        method,
        url: this.baseURL + url,
        headers,
        data,
      });
      return {
        success: true,
        statusCode: response.status,
        statusText: response.statusText,
        responseBody: response.data,
      } as Response;
    } catch (error) {
      return {
        success: false,
        statusCode: error.response.status,
        statusText: error.response.statusText,
        responseBody: error.response.data,
        errorCode: error.response.data.errorCode,
        errorMessage: error.response.data.errorMessage,
      } as Response;
    }
  }
}

export default class SDP {
  username: string;
  password: string;
  cpID: string;
  request: Request;
  token: string;
  baseURL: string;

  constructor(username: string, password: string, cpID: string) {
    this.username = username;
    this.password = password;
    this.cpID = cpID;
    this.baseURL =
      process.env.DEPLOYMENT_MODE === "release"
        ? "https://dsvc.safaricom.com:9480/api/"
        : "https://dtsvc.safaricom.com:8480/api/";
  }

  init = async () => {
    try {
      this.request = new Request(this.baseURL);
      this.token = await this.getAccessToken();
    } catch (error) {
      console.log(error);
    }
  };

  private async getAccessToken(): Promise<string> {
    const body = {
      username: this.username,
      password: this.password,
    };

    const response = await this.request.send("POST", "auth/login", body, {});
    if (!response.success) {
      throw new Error(response.errorMessage);
    }
    return response.responseBody.token;
  }

  generateTimestamp(): string {
    return new Date().toISOString().replace(/z|t/gi, " ").trim();
  }
}

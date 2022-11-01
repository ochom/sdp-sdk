import axios from "axios";

export interface Response {
  success: boolean;
  statusCode: number;
  statusText: string;
  responseBody: any;
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
        statusCode: 500,
        statusText: error.message,
      } as Response;
    }
  }
}

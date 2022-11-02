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
    const response: Response = {
      success: false,
      statusCode: 0,
      statusText: "",
      responseBody: {},
    };
    headers = { ...this.headers, ...headers };
    console.log("headers", headers);
    url = `${this.baseURL}${url}`;
    await axios({
      method,
      url,
      headers,
      data,
    })
      .then((res) => {
        response.success = true;
        response.statusCode = res.status;
        response.statusText = res.statusText;
        response.responseBody = res.data;
      })
      .catch((err) => {
        response.success = false;
        response.statusCode = err.response.status;
        response.statusText = err.response.statusText;
        response.responseBody = err.response.data;
      });
    return response;
  }
}

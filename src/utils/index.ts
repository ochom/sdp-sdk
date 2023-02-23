import axios from "axios";

export interface Response {
  success?: boolean;
  statusCode?: number;
  statusText?: string;
  responseBody?: any;
}

const catchError = (error: any): Response => {
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
    response.responseBody = error.request;
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

  constructor(baseURL: string) {
    this.baseURL = baseURL;
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
      const res = await axios({
        method,
        url,
        data,
        headers,
      });
      response.success = true;
      response.statusCode = res.status;
      response.statusText = res.statusText;
      response.responseBody = res.data;
    } catch (error) {
      response = catchError(error);
      console.log(url, method, data, headers);
    }

    return response;
  }
}

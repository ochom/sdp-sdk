import { Request } from "../utils";

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
      throw new Error(error.message);
    }
  };

  private async getAccessToken(): Promise<string> {
    const body = {
      username: this.username,
      password: this.password,
    };

    const response = await this.request.send("POST", "auth/login", body, {});
    if (!response.success) {
      throw new Error(response.statusText);
    }
    return response.responseBody.token;
  }

  generateTimestamp(): string {
    return new Date().toISOString().replace(/z|t/gi, " ").trim();
  }
}

import { Request } from "../utils";

const devURL = "https://dtsvc.safaricom.com:8480/api/";
const prodURL = "https://dsvc.safaricom.com:9480/api/";

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
      process.env.DEPLOYMENT_MODE === "production" ? prodURL : devURL;
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

    const { token } = response.responseBody;

    return token;
  }

  generateTimestamp(): string {
    return new Date().toISOString().replace(/z|t/gi, " ").trim();
  }
}

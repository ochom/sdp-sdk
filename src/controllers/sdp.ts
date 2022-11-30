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
    const date = new Date();
    const yy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    const month = mm < 10 ? `0${mm}` : mm;
    const day = d < 10 ? `0${d}` : d;
    const hour = h < 10 ? `0${h}` : h;
    const minute = m < 10 ? `0${m}` : m;
    const second = s < 10 ? `0${s}` : s;

    return `${yy}${month}${day}${hour}${minute}${second}`;
  }
}

import { DeploymentMode, Request } from "../utils";

import Token from "../utils/token";

export default class SDP {
  username: string;
  password: string;
  cpID: string;
  request: Request;
  token: Token;
  accessToken: string;
  deploymentMode: DeploymentMode;

  constructor(
    myToken: Token,
    username: string,
    password: string,
    cpID: string
  ) {
    this.token = myToken;
    this.username = username;
    this.password = password;
    this.cpID = cpID;
    this.deploymentMode = process.env.DEPLOYMENT_MODE as DeploymentMode;
  }

  init = async () => {
    try {
      this.request = new Request(this.deploymentMode);
      const token = await this.token.getAccessToken();
      if (token !== "") {
        if (!this.token.isExpired()) {
          // if token is not expired
          this.accessToken = token;
        } else {
          // if token is expired
          this.token.setFetching();
          this.accessToken = await this.getAccessToken();
          this.token.set(this.accessToken);
        }
      } else {
        // if token is empty
        this.token.setFetching();
        this.accessToken = await this.getAccessToken();
        this.token.set(this.accessToken);
      }
    } catch (error) {
      this.token.setFetching(false);
      throw error;
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

export default class Token {
  private value: string;
  private generatedAt: number;
  private loading: boolean;

  constructor() {
    this.value = "";
    this.generatedAt = 0;
    this.loading = false;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getAccessToken = async (): Promise<string> => {
    // if token is loading wait for it to finish loading
    // this is to prevent multiple requests to get token
    if (this.loading) {
      await this.sleep(1000);
      return this.getAccessToken();
    }

    return this.value;
  };

  set = (newToken: string): void => {
    this.value = newToken;
    this.generatedAt = Date.now();
    this.loading = false;
  };

  setFetching = (): void => {
    this.loading = true;
  };

  isExpired = (): boolean => {
    const now = Date.now();
    return now - this.generatedAt > 25 * 60 * 1000; // token expires in 30 minutes, generate a new one after 25 minutes
  };
}

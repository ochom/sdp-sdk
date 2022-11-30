export default class MyToken {
  accessToken: string;
  generatedAt: number;

  constructor() {
    this.accessToken = "";
    this.generatedAt = 0;
  }

  get = (): string => {
    return this.accessToken;
  };

  set = (accessToken: string): void => {
    this.accessToken = accessToken;
    this.generatedAt = Date.now();
  };

  isExpired = (): boolean => {
    const now = Date.now();
    return now - this.generatedAt > 25 * 60 * 1000; // token expires in 30 minutes, generate a new one after 25 minutes
  };
}

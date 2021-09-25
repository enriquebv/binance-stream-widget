import axios, { AxiosInstance, AxiosPromise } from "axios";
import crypto from "crypto";

export class BinanceApi {
  client: AxiosInstance;
  secret: string;
  symbolsPrices: Record<string, number>;

  constructor(binanceApiKey, binanceApiSecret) {
    this.secret = binanceApiSecret;
    this.client = axios.create({
      baseURL: "https://api.binance.com",
      headers: {
        "X-MBX-APIKEY": binanceApiKey,
      },
    });
  }

  async extractData(request: AxiosPromise) {
    return (await request).data;
  }

  getFormattedParams(obj, type: "query" | "form"): string | FormData {
    switch (type) {
      case "query":
        return Object.keys(obj).reduce(
          (acc, key, index) => (acc += `${(index !== 0 && "&") || ""}${key}=${obj[key]}`),
          ""
        );
      case "form":
        const formData = new FormData();
        Object.keys(obj).forEach((key) => formData.append(key, obj[key]));
        return formData;
    }
  }

  getSignature(query) {
    return crypto.createHmac("sha256", this.secret).update(query).digest("hex");
  }

  async getUser() {
    const params = {
      timestamp: new Date().valueOf(),
      recvWindow: 5000,
    };
    const query = this.getFormattedParams(params, "query");
    const signature = this.getSignature(query);
    const finalQuery = this.getFormattedParams({ ...params, signature }, "query");
    return this.extractData(this.client.get(`/api/v3/account?${finalQuery}`));
  }

  async getUSDPrice(symbols: string[]) {
    const prices = await this.extractData(this.client.get(`/api/v3/ticker/price`));
    let result = {};

    symbols.forEach((symbol) => {
      const priceFound = prices.find((price) => price.symbol === `${symbol}USDT`);
      result[symbol] = priceFound ? Number(priceFound.price) : null;
    });

    return result;
  }
}

import { BinanceApi } from "../../lib/binance-api";
import { parse } from "querystring";
import cryptoPrice from "../../lib/crypto-price";

export default async function handler(req, res) {
  try {
    const params = parse(req.url.split("?")[1] || "");

    if (!params.binance_api_key || !params.binance_secret_key) {
      res.status(400).send("Missing binance_api_key or binance_secret_key");
    }

    const binance = new BinanceApi(params.binance_api_key, params.binance_secret_key);
    const user = await binance.getUser();
    const symbolsToCheck = user.balances
      .filter((balance) => Number(balance.free) + Number(balance.locked) !== 0)
      .map((balance) => balance.asset);
    const prices = await binance.getUSDPrice(symbolsToCheck);
    const balances = user.balances
      .filter((balance) => Number(balance.free) + Number(balance.locked) !== 0)
      .map((balance) => {
        const total = Number(balance.free) + Number(balance.locked);
        const price = prices[balance.asset] || null;
        const totalPrice = price ? total * price : null;
        return { asset: balance.asset, total, price, totalPrice };
      });
    const totalPrice = balances.reduce((acc, balance) => (acc += balance.totalPrice), 0);
    res.send({ totalPrice, balances });
  } catch (error) {
    if (!error.response) {
      res.send(error.message);
      return;
    }

    res.status(error.response.status).send(error.response.data);
  }
}

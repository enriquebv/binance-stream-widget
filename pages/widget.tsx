import { useEffect, useState } from "react";
import { parse } from "querystring";
import axios from "axios";

let poolInterval;

const formatMoney = (number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number);

import styles from "./widget.module.scss";

export default function WidgetPage() {
  const [balance, setBalance] = useState(null);
  const [textColor, setTextColor] = useState("#000");
  const [error, setError] = useState("");

  // I know, WebSocket it's better than pooling, but it's a small project
  function startFetchPooling() {
    hydrateBalance();
    poolInterval = setInterval(hydrateBalance, 5 * 1000 * 60);
  }

  function stopFetchPooling() {
    clearInterval(poolInterval);
  }

  async function hydrateBalance() {
    try {
      // throw new Error("");
      const response = await axios.get(`/api/balance/?${window.location.href.split("?")[1]}`);
      setError("");
      setBalance(response.data);
    } catch (error) {
      setError("Unknown error with Binance API.");
    }
  }

  useEffect(() => {
    const query = window.location.href.split("?")[1] || "";
    const params = parse(query);

    if (!params.binance_api_key || !params.binance_secret_key) {
      setError("Invalid widget, generate it again.");
      return;
    }

    if (params.text_color) setTextColor(params.text_color as string);

    startFetchPooling();

    return stopFetchPooling;
  }, []);

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}
      {balance && !error && (
        <p className={styles.value} style={{ color: textColor }}>
          {formatMoney(balance.totalPrice)}
        </p>
      )}
    </>
  );
}

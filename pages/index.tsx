import { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import styles from "./index.module.scss";

export default function Home() {
  const [binanceApiKey, setBinanceApiKey] = useState("");
  const [binanceSecretKey, setBinanceSecretKey] = useState("");
  const [textColor, setTextColor] = useState("#000");
  const [widgetUrl, setWidgetUrl] = useState("");

  useEffect(() => {
    setWidgetUrl("");
  }, [binanceApiKey, binanceSecretKey, textColor]);

  async function handleGenerate() {
    let url = `${window.location.href}/widget/`;

    url += `?binance_api_key=${binanceApiKey}`;
    url += `&binance_secret_key=${binanceSecretKey}`;
    url += `&text_color=${textColor}`;

    setWidgetUrl(url);
  }

  async function handleCopy() {
    copy(widgetUrl);
  }

  return (
    <div className={styles.home}>
      <h1>Binance Stream Widget</h1>
      <h2>Show your binance balance in stream</h2>

      <p className={styles.description}>
        1. Paste the{" "}
        <a target="__blank" href="https://www.binance.com/es/my/settings/api-management">
          binance API keys
        </a>{" "}
        here:
      </p>
      <div className={styles.keys}>
        <input
          type="password"
          placeholder="Binance API Key"
          onInput={(e) => setBinanceApiKey((e.target as HTMLInputElement).value)}
        />
        <input
          type="password"
          placeholder="Binance Secret KEY"
          onInput={(e) => setBinanceSecretKey((e.target as HTMLInputElement).value)}
        />
      </div>

      <p>
        <b>HELP:</b>{" "}
        <ul>
          <li>
            <a target="__blank" href="https://www.binance.com/en/support/faq/360002502072">
              How to create the API keys
            </a>
          </li>
          <li>
            <a target="__blank" href="https://www.binance.com/es-ES/support/faq/360002502072">
              How to create the API keys (Spanish)
            </a>
          </li>
        </ul>
      </p>
      <p>
        <b>READ THIS:</b>
        <ul>
          <li>
            This project is{" "}
            <a href="https://github.com/enriquebv/binance-stream-widget" target="__blank">
              open-sourced here
            </a>
            , so feel free to check the code to ensure is not a scam.
          </li>
          <li>
            If you share the widget URL, someone can extract the API keys to trade, because that is safer to set the API
            key restrictions only to <b> Enable reading.</b>
          </li>
          <li>
            {"Don't"} set IP access restrictions in Binance, because the widget will not work. Binance {"can't"} accept
            browser requests, because they are proxied in a server.
          </li>
          <li>No, API keys are not stored in the server, {"that's"} why they are in the widget URL.</li>
          <li>
            <u>
              <b>NEVER</b>
            </u>{" "}
             share your generated widget URL, {"you're"} at your own risk.
          </li>
          <li>Prices are checked with USDT price.</li>
        </ul>
      </p>

      <p className={styles.description}>2. Select text color:</p>
      <label>
        <p className={styles.description} style={{ fontSize: "1.2em" }}>
          🎨
        </p>
        <input type="color" onChange={(e) => setTextColor((e.target as HTMLInputElement).value)} />
      </label>

      <br />
      <br />

      <button onClick={handleGenerate}>Generate widget</button>

      <br />
      <br />

      <div className={styles.result}>
        <input
          value={widgetUrl}
          type="password"
          readOnly
          disabled={widgetUrl.length === 0}
          placeholder="Enter Binance API Keys and generate widget"
        />
        <button onClick={handleCopy}>Copy</button>
      </div>
    </div>
  );
}

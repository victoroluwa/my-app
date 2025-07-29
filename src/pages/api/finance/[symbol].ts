// /pages/api/finance/[symbol].ts or .js
import axios from "axios";

export default async function handler(req: { query: { symbol: any; interval?: "1m" | undefined; range?: "1d" | undefined; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  const { symbol, interval = "1m", range = "1d" } = req.query;

  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
      params: {
        interval,
        range,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Yahoo Finance API Error:", error.message);
    } else {
      console.error("Yahoo Finance API Error:", error);
    }
    res.status(500).json({ error: "Failed to fetch data from Yahoo Finance." });
  }
}
 
import { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import "./App.css";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [selected, setSelected] = useState(null); // {symbol, name}
  const [prices, setPrices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // load companies
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/companies`);
        const data = await res.json();
        setCompanies(data);
      } catch (e) {
        setError("Failed to load companies");
      } finally {
        setLoadingCompanies(false);
      }
    })();
  }, []);

  const loadData = async (c) => {
    setError(null);
    setSelected(c);
    setLoadingData(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/prices?symbol=${encodeURIComponent(c.symbol)}`),
        fetch(`${API}/stats?symbol=${encodeURIComponent(c.symbol)}`),
      ]);
      if (!pRes.ok) throw new Error("Price fetch failed");
      if (!sRes.ok) throw new Error("Stats fetch failed");

      const pData = await pRes.json();
      const sData = await sRes.json();

      setPrices(pData);
      setStats(sData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingData(false);
    }
  };

  const chartData = useMemo(
    () =>
      prices.map((r) => ({
        date: r.Date,
        close: Number(r.Close?.toFixed ? r.Close.toFixed(2) : r.Close),
      })),
    [prices]
  );

  const formatNum = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : "-";

  const downloadCSV = () => {
    if (!prices.length || !selected) return;
    const headers = Object.keys(prices[0]);
    const rows = prices.map((r) => headers.map((h) => r[h]));
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected.symbol}_prices.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <h2>📃 Companies</h2>

        {loadingCompanies && <p>Loading…</p>}
        {error && <p style={{ color: "tomato" }}>{error}</p>}

        {companies.map((c) => (
          <div key={c.symbol} className="company-card">
            <div className="symbol">{c.symbol}</div>
            <div className="name">{c.name}</div>
            <button onClick={() => loadData(c)}>
              {selected?.symbol === c.symbol && loadingData ? "Loading…" : "View Prices"}
            </button>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="main">
        <div className="header">
          <h1 className="title">📊 Stock Dashboard</h1>
          <div className="actions">
            <button className="btn" onClick={() => window.location.reload()}>
              Refresh
            </button>
            <button
              className="btn primary"
              disabled={!prices.length}
              onClick={downloadCSV}
              title={prices.length ? "Download CSV" : "Load any company first"}
            >
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {!selected && <p style={{ marginTop: 10 }}>Left panel से कोई company चुनो.</p>}

        {selected && (
          <>
            <div className="grid">
              <div className="card">
                <h3>
                  Price Chart — <span style={{ color: "#93c5fd" }}>{selected.name}</span>
                </h3>
                {loadingData ? (
                  <p>Loading chart…</p>
                ) : chartData.length ? (
                  <div style={{ height: 360 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#2a2a2a" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(v) => formatNum(v)}
                          labelFormatter={(l) => `Date: ${l}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="close"
                          stroke="#60a5fa"
                          fillOpacity={1}
                          fill="url(#c1)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p>No data.</p>
                )}
              </div>

              <div className="card">
                <h3>Key Stats (52-Week)</h3>
                {loadingData && <p>Loading stats…</p>}
                {stats && (
                  <div className="stats">
                    <div className="stat">
                      <div className="label">Latest Close</div>
                      <div className="value">₹ {formatNum(stats.latest_close)}</div>
                    </div>
                    <div className="stat">
                      <div className="label">52-Week High</div>
                      <div className="value">₹ {formatNum(stats.high_52wk)}</div>
                    </div>
                    <div className="stat">
                      <div className="label">52-Week Low</div>
                      <div className="value">₹ {formatNum(stats.low_52wk)}</div>
                    </div>
                    <div className="stat">
                      <div className="label">Average Volume</div>
                      <div className="value">{formatNum(stats.avg_volume)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ marginTop: 18 }}>
              <h3>Price Data for {selected.name}</h3>
              {loadingData ? (
                <p>Loading table…</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((r, i) => (
                        <tr key={i}>
                          <td>{r.Date}</td>
                          <td>{formatNum(r.Open)}</td>
                          <td>{formatNum(r.High)}</td>
                          <td>{formatNum(r.Low)}</td>
                          <td>{formatNum(r.Close)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

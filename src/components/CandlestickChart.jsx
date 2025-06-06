// CandlestickChart.js
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';

const CandlestickChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch('/data.csv')
      .then((response) => response.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        const dates = [];
        const open = [];
        const high = [];
        const low = [];
        const close = [];

        parsed.data.forEach(row => {
          if (row.Date) {
            dates.push(row.Date);
            open.push(parseFloat(row.Open));
            high.push(parseFloat(row.High));
            low.push(parseFloat(row.Low));
            close.push(parseFloat(row.Close));
          }
        });

        setChartData([
          {
            x: dates,
            open,
            high,
            low,
            close,
            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y',
          }
        ]);
      });
  }, []);

  return (
    chartData ? (
      <Plot
        data={chartData}
        layout={{
          title: 'MSFT Candlestick Chart from CSV',
          xaxis: { title: 'Date' },
          yaxis: { title: 'Price' },
          autosize: true,
          margin: { t: 50, l: 50, r: 50, b: 50 },
        }}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
      />
    ) : (
      <p>Loading chart...</p>
    )
  );
};

export default CandlestickChart;

from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import os
import traceback
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get-stock-data', methods=['POST'])
def get_stock_data():
    # Get the stock symbol from the request JSON body
    symbol = request.json.get('symbol', None)

    if not symbol:
        return jsonify({'message': 'Stock symbol is required.'}), 400

    # --- SETTINGS ---
    interval = '1d'  # Daily candles

    # --- DATE RANGE: Last 1 Month ---
    end_date = datetime.today()
    start_date = end_date - timedelta(days=30)

    try:
        print(f"Fetching data for: {symbol}")
        ticker = yf.Ticker(symbol)
        data = ticker.history(start=start_date, end=end_date, interval=interval)

        if data.empty:
            return jsonify({'message': f'No data found for symbol {symbol} in the last 30 days.'}), 404

        # Format the data
        data = data[['Open', 'High', 'Low', 'Close', 'Volume']]
        data.reset_index(inplace=True)
        data['Date'] = data['Date'].dt.date
        formatted_data = data[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]

        # Insert the symbol as the second row
        symbol_row = pd.Series([None, symbol, symbol, symbol, symbol, symbol], index=formatted_data.columns)
        formatted_data.loc[-1] = symbol_row  # Insert the symbol row at the beginning
        formatted_data.index = formatted_data.index + 1  # Shift the index
        formatted_data.sort_index(inplace=True)

        # Save to CSV in current working directory
        filename = os.path.join(os.getcwd(), "data.csv")
        formatted_data.to_csv(filename, index=False, header=True)
        print(f"Data saved to: {filename}")

        return jsonify({'message': f'Data saved to {filename} in the desired format.'})

    except Exception as e:
        traceback.print_exc()
        # Check if it's a rate-limit issue
        if 'rate' in str(e).lower() or 'Too Many Requests' in str(e):
            return jsonify({'message': 'Rate limited by Yahoo Finance. Try again later.'}), 429
        return jsonify({'message': f'Error fetching data for {symbol}: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)

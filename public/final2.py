from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta
import os
import traceback
import pandas as pd

app = Flask(__name__)
CORS(app)

# ======== ROUTE 1: Fetch Stock Data ========
@app.route('/get-stock-data', methods=['POST'])
def get_stock_data():
    symbol = request.json.get('symbol', None)
    if not symbol:
        return jsonify({'message': 'Stock symbol is required.'}), 400

    interval = '1d'
    end_date = datetime.today()
    start_date = end_date - timedelta(days=30)

    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(start=start_date, end=end_date, interval=interval)

        if data.empty:
            return jsonify({'message': f'No data found for symbol {symbol}.'}), 404

        data = data[['Open', 'High', 'Low', 'Close', 'Volume']]
        data.reset_index(inplace=True)
        data['Date'] = data['Date'].dt.date
        formatted_data = data[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']]

        # Adding the stock symbol as a row at the top of the DataFrame
        symbol_row = pd.Series([None, symbol, symbol, symbol, symbol, symbol], index=formatted_data.columns)
        formatted_data.loc[-1] = symbol_row
        formatted_data.index = formatted_data.index + 1
        formatted_data.sort_index(inplace=True)

        # Ensure the correct format for saving to CSV
        formatted_data['Date'] = formatted_data['Date'].astype(str)  # Convert date to string for CSV compatibility
        filename = os.path.join(os.getcwd(), "data.csv")

        # Save data to CSV with desired format
        formatted_data.to_csv(filename, index=False, header=True)

        return jsonify({'message': f'Data saved to {filename} in the desired format.'})

    except Exception as e:
        traceback.print_exc()
        if 'rate' in str(e).lower() or 'Too Many Requests' in str(e):
            return jsonify({'message': 'Rate limited by Yahoo Finance. Try again later.'}), 429
        return jsonify({'message': f'Error fetching data for {symbol}: {str(e)}'}), 500

   # ======== Candlestick Pattern Functions ========
    def is_doji(open_price, high, low, close, tolerance=0.1):
        body = abs(close - open_price)
        total_range = high - low
        return total_range != 0 and body <= total_range * tolerance

    def is_marubozu(open_price, high, low, close, shadow_tolerance=0.05):
        body = abs(close - open_price)
        upper_shadow = high - max(open_price, close)
        lower_shadow = min(open_price, close) - low
        total_range = high - low
        return (
            body >= total_range * (1 - shadow_tolerance)
            and upper_shadow <= total_range * shadow_tolerance
            and lower_shadow <= total_range * shadow_tolerance
        )

    def is_spinning_top(open_price, high, low, close, shadow_ratio=1.5):
        body = abs(close - open_price)
        upper_shadow = high - max(open_price, close)
        lower_shadow = min(open_price, close) - low
        total_range = high - low
        return (
            total_range != 0 and
            body <= total_range * 0.3 and
            upper_shadow > body * shadow_ratio and
            lower_shadow > body * shadow_ratio
        )

    def is_hammer(open_price, high, low, close):
        body = abs(close - open_price)
        upper_shadow = high - max(open_price, close)
        lower_shadow = min(open_price, close) - low
        total_range = high - low
        return body < total_range * 0.3 and lower_shadow > 2 * body and upper_shadow < body

    def is_inverted_hammer(open_price, high, low, close):
        body = abs(close - open_price)
        upper_shadow = high - max(open_price, close)
        lower_shadow = min(open_price, close) - low
        total_range = high - low
        return body < total_range * 0.3 and upper_shadow > 2 * body and lower_shadow < body

    def is_bullish_engulfing(prev_open, prev_close, curr_open, curr_close):
        return prev_close < prev_open and curr_close > curr_open and curr_open < prev_close and curr_close > prev_open

    def is_bearish_engulfing(prev_open, prev_close, curr_open, curr_close):
        return prev_close > prev_open and curr_close < curr_open and curr_open > prev_close and curr_close < prev_open

    def is_bullish_harami(prev_open, prev_close, curr_open, curr_close):
        return prev_close < prev_open and curr_close > curr_open and curr_open > prev_close and curr_close < prev_open

    def is_bearish_harami(prev_open, prev_close, curr_open, curr_close):
        return prev_close > prev_open and curr_close < curr_open and curr_open < prev_close and curr_close > prev_open

    def is_double_top(df, index, tolerance=0.02, lookback=5):
        if index < 2 or index + 1 >= len(df):
            return False
        high1 = df['High'][index - 2]
        high2 = df['High'][index]
        low_between = df['Low'][index - 1]
        return abs(high1 - high2) / high1 <= tolerance and low_between < high1 and low_between < high2 and is_near_top(df, index, lookback)

    def is_double_bottom(df, index, tolerance=0.02, lookback=5):
        if index < 2 or index + 1 >= len(df):
            return False
        low1 = df['Low'][index - 2]
        low2 = df['Low'][index]
        high_between = df['High'][index - 1]
        return abs(low1 - low2) / low1 <= tolerance and high_between > low1 and high_between > low2 and is_near_bottom(df, index, lookback)

    def is_near_top(df, index, lookback=5):
        if index < lookback:
            return False
        return df['High'].iloc[index] == max(df['High'].iloc[max(0, index - lookback):index + 1])

    def is_near_bottom(df, index, lookback=5):
        if index < lookback:
            return False
        return df['Low'].iloc[index] == min(df['Low'].iloc[max(0, index - lookback):index + 1])

    def calculate_base_score(pattern_name, location):
        name = pattern_name.lower()
        loc = location.lower()
        if 'bullish' in name:
            return 2
        elif 'bearish' in name:
            return -2
        elif 'doji' in name or 'spinningtop' in name:
            return 0.5 if loc != "top" else -0.5
        elif 'doublebottom' in name or 'bottom' in name:
            return 1.5
        elif 'doubletop' in name or 'top' in name:
            return -1.5
        elif 'hammer' in name and 'inverted' not in name:
            return 1.5 if loc == "bottom" else 0.5
        elif 'invertedhammer' in name:
            return 1.0 if loc == "bottom" else 0.5
        elif 'marubozu' in name:
            return 0.5
        else:
            return 0

    def score_pattern(base_score, date_str, location, volume, latest_date):
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        days_ago = (latest_date - date_obj).days
        recency_weight = max(0.1, (30 - days_ago) / 30)
        location_multiplier = {
            "Top": 1.2 if base_score < 0 else 0.8,
            "Bottom": 1.2 if base_score > 0 else 0.8,
            "Middle": 1.0
        }
        volume_factor = 1 + (volume / 1_000_000)
        return base_score * recency_weight * location_multiplier.get(location, 1.0) * volume_factor

    # ======== ROUTE 2: Analyze CSV for Patterns ========
    @app.route('/api/data')
    def get_patterns():
        try:
            df = pd.read_csv("data.csv", skiprows=[1])
            
            raw_patterns = {
                "Doji": [], "DoubleTop": [], "DoubleBottom": [], "BullishEngulfing": [],
                "BearishEngulfing": [], "Hammer": [], "InvertedHammer": [],
                "BullishHarami": [], "BearishHarami": [], "Marubozu": [], "SpinningTop": []
            }

            for i in range(len(df)):
                row = df.iloc[i]
                o, h, l, c, v = row['Open'], row['High'], row['Low'], row['Close'], row['Volume']

                for pattern_func, name in [
                    (is_doji, "Doji"), (is_marubozu, "Marubozu"), (is_spinning_top, "SpinningTop"),
                    (is_hammer, "Hammer"), (is_inverted_hammer, "InvertedHammer")
                ]:
                    if pattern_func(o, h, l, c):
                        loc = "Top" if is_near_top(df, i) else "Bottom" if is_near_bottom(df, i) else "Middle"
                        raw_patterns[name].append({"date": row['Date'], "location": loc, "volume": int(v)})

                if i >= 2 and i + 1 < len(df):
                    if is_double_top(df, i):
                        loc = "Top" if is_near_top(df, i) else "Bottom" if is_near_bottom(df, i) else "Middle"
                        raw_patterns["DoubleTop"].append({"date": df['Date'][i], "location": loc, "volume": int(df['Volume'][i])})
                    if is_double_bottom(df, i):
                        loc = "Top" if is_near_top(df, i) else "Bottom" if is_near_bottom(df, i) else "Middle"
                        raw_patterns["DoubleBottom"].append({"date": df['Date'][i], "location": loc, "volume": int(df['Volume'][i])})

            for i in range(1, len(df)):
                prev, curr = df.iloc[i - 1], df.iloc[i]
                if is_bullish_engulfing(prev['Open'], prev['Close'], curr['Open'], curr['Close']):
                    loc = "Bottom" if is_near_bottom(df, i) else "Top" if is_near_top(df, i) else "Middle"
                    raw_patterns["BullishEngulfing"].append({"date": curr['Date'], "location": loc, "volume": int(curr['Volume'])})
                elif is_bearish_engulfing(prev['Open'], prev['Close'], curr['Open'], curr['Close']):
                    loc = "Top" if is_near_top(df, i) else "Bottom" if is_near_bottom(df, i) else "Middle"
                    raw_patterns["BearishEngulfing"].append({"date": curr['Date'], "location": loc, "volume": int(curr['Volume'])})

                if is_bullish_harami(prev['Open'], prev['Close'], curr['Open'], curr['Close']):
                    raw_patterns["BullishHarami"].append({"date": curr['Date'], "location": "Bottom", "volume": int(curr['Volume'])})
                elif is_bearish_harami(prev['Open'], prev['Close'], curr['Open'], curr['Close']):
                    raw_patterns["BearishHarami"].append({"date": curr['Date'], "location": "Top", "volume": int(curr['Volume'])})

            all_dates = [entry["date"] for pattern in raw_patterns.values() for entry in pattern]
            latest_date = max(datetime.strptime(d, "%Y-%m-%d") for d in all_dates) if all_dates else datetime.today()

            total_score = 0
            detailed_scores = []

            for pattern, entries in raw_patterns.items():
                for entry in entries:
                    base = calculate_base_score(pattern, entry["location"])
                    score = score_pattern(base, entry["date"], entry["location"], entry["volume"], latest_date)
                    total_score += score
                    entry["score"] = round(score, 2)
                    detailed_scores.append(entry)

            if total_score > 2:
                forecast = "📈 Likely Bullish trend next week"
            elif total_score < -2:
                forecast = "📉 Likely Bearish trend next week"
            else:
                forecast = "➖ Trend Uncertain or Neutral next week"

            return jsonify({
                "total_score": round(total_score, 2),
                "forecast": forecast,
                "patterns": raw_patterns,
                "details": detailed_scores
            })

        except Exception as e:
            traceback.print_exc()
            return jsonify({"error": str(e)}), 500


# ======== Main ========
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)

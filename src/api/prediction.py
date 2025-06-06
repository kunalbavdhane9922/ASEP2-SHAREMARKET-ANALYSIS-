import requests
from datetime import datetime
import json

# ========== CONFIG ========== #
API_DATA_URL = "http://localhost:5000/api/data"

# ========== SCORING LOGIC ========== #
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

# ========== MAIN LOGIC ========== #
def fetch_predict_and_upload():
    try:
        print("🔄 Fetching data from /api/data...\n")
        response = requests.get(API_DATA_URL)
        response.raise_for_status()
        pattern_data = response.json()

        all_dates = [entry["date"] for pattern in pattern_data.values() for entry in pattern]
        if not all_dates:
            print("❌ No pattern data available.")
            return

        latest_date = max(datetime.strptime(d, "%Y-%m-%d") for d in all_dates)
        total_score = 0
        pattern_scores = []

        print("📊 Pattern Analysis:\n")
        for pattern, occurrences in pattern_data.items():
            for entry in occurrences:
                base = calculate_base_score(pattern, entry["location"])
                score = score_pattern(base, entry["date"], entry["location"], entry["volume"], latest_date)
                total_score += score

                pattern_scores.append({
                    "pattern": pattern,
                    "date": entry["date"],
                    "location": entry["location"],
                    "volume": entry["volume"],
                    "score": round(score, 2)
                })

                print(f"🧩 {pattern} on {entry['date']} @ {entry['location']} | Volume: {entry['volume']} → Score: {score:.2f}")

        if total_score > 2:
            forecast = "📈 Likely Bullish trend next week"
        elif total_score < -2:
            forecast = "📉 Likely Bearish trend next week"
        else:
            forecast = "➖ Trend Uncertain or Neutral next week"

        print("\n🔎 Final Score:", round(total_score, 2))
        print("🧠 Forecast:", forecast)

        result = {
            "total_score": round(total_score, 2),
            "forecast": forecast,
            "details": pattern_scores
        }

        # 🔼 POST the updated data to /api/data
        post_response = requests.post(API_DATA_URL, json=result)
        if post_response.status_code == 200:
            print("\n✅ Updated pattern data successfully uploaded to /api/data!")
        else:
            print("\n⚠️ Failed to update data. Status code:", post_response.status_code)

    except Exception as e:
        print("❌ Error:", str(e))

# ========== RUN ========== #
if __name__ == "__main__":
    fetch_predict_and_upload()

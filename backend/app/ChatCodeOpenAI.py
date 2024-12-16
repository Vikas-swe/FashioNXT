import openai

# Set your API key
openai.api_key = OPENAI_API_KEY

from datetime import datetime

# Get the current month name
current_month = datetime.now().strftime("%B")  # e.g., "December"
print (current_month)
def get_user_preference(user_input):
    # Define the prompt
    prompt = f"""
    You are a virtual stylist specializing in Indian fashion and styles. Based on the user's input, including their preferences, location (India), and the month of the event, answer the following questions with one choice for each. Consider seasonal weather and any major festivals or occasions in India for your recommendations.
    Determine month and then decide wether on your own
    The questions and their choices are:
    
    1. type:
       - Wedding
       - Traditional Festival
       - Beach Day
       - Casual Outing
       - Workout
       - Date Night
       - Office Wear
       - Party
    
    2. occasion:
       - Elegant
       - Relaxed
       - Bold
       - Trendy
       - Professional
    
    3. weather_preference:
       - Hot
       - Cold
       - Rainy
       - Neutral
    
    4. color_preferences:
       - Pastels
       - Brights
       - Neutrals
       - Jewel Tones
    
    5. cloth_preferences:
       - Traditional (e.g., Saree, Kurta, Sherwani)
       - Indo-Western
       - Modern
       - Minimalist
       - Sporty
    
    6. material_preferences:
       - Cotton
       - Silk
       - Khadi
       - Linen
       - Wool
    
    7. budget_range:
       - Low
       - Medium
       - Premium
    
    8. fit_preference:
       - Fitted
       - Relaxed
       - Loose
    
    Current Month: "{current_month}"
    
    User Input: "{user_input}"
    
    Please return only a JSON object with one answer for each question.
    """

    # Make the API call
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a virtual stylist."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    # Parse the response
    stylist_response = response["choices"][0]["message"]["content"]
    return stylist_response
# print(stylist_response)

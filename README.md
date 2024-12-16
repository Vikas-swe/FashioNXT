# FashioNXT: AI-First Smart Fashion Companion

## Problem Statement

Online fashion shopping often leads to dissatisfaction due to size mismatches, poor visualization, and generic recommendations. This results in high return rates, reduced sales, and lower customer confidence. Retailers struggle with operational inefficiencies and lost revenue from these challenges.

## Who Is It Solving For?

### Consumers:
- **Personalized Recommendations**: Tailored to body measurements, skin tone, and style preferences.
- **Virtual Try-On**: Try on clothes virtually for better confidence in purchases.

### Retailers:
- **Reduced Returns**: Minimizing returns and operational costs.
- **Increased Sales**: Boosting conversions through AI-driven personalization.

## Benefits & Real-World Impact

- **Reduced Returns**: Save up to 30% on return costs and logistics.
- **Increased Sales**: Boost conversions by 20-30% with personalized shopping.
- **Improved Customer Loyalty**: Enhanced shopping experience leads to repeat business.
- **Sustainability**: Fewer returns reduce environmental impact.

FashioNXT bridges the gap between traditional shopping and a futuristic, AI-powered experience, benefiting both customers and retailers.

---

## Solution Overview

### FashioNXT: Your AI-First Smart Fashion Companion

**FashioNXT** is an AI-powered fashion commerce platform designed to deliver a highly personalized and intuitive shopping experience. By leveraging advanced image processing and tailored AI models, FashioNXT makes fashion shopping smarter, faster, and more enjoyable.

### Core Features

- **Intelligent Onboarding**: Extract body measurements and skin tone, reducing the chances of size mismatches and minimizing operational overheads.
- **Personalized Style Suggestions**: AI-driven recommendations based on user preferences, mood, occasion, and style, triggered by a single prompt.
- **Virtual Try-On**: Visualize products in real-time with saved poses for enhanced confidence. Mix and match different clothes for a personalized experience, leading to higher satisfaction and fewer refunds.
- **Seamless Shopping Journey**: Enjoy an intuitive and user-friendly experience from onboarding to checkout.

---

## How It Solves the Problem

- **Precision**: Eliminates guesswork in sizing and style, offering highly accurate recommendations.
- **Reduced Returns**: Confident purchase decisions mean fewer returns and higher sales.
- **Enhanced Customer Experience**: Engaging, personalized, and enjoyable shopping process leads to improved satisfaction.

---

## Technology Stack

### Programming Languages:
- **Python**: Backend, AI models/transformations
- **JavaScript**: Frontend

### Frameworks and Tools:
- **React**: Frontend framework for a seamless and responsive UI.
- **ShadCN**: UI Component Library
- **Flask/Django**: Backend API management and logic implementation.

### AI Tools:
- **OpenCV, Mediapipe, SKLearn**: Image processing for body measurements and skin tone analysis.
- **OpenAI LLM**: Recommendation from prompt. Returning a map of questions/filters (style, occasion, feel, color preference, etc.) and answers from the prompt.
- **PyTorch, Tensorboard, Torchvision**: For the Try-On model, based on the paper [link](https://arxiv.org/abs/2306.08276).

### Cloud Infrastructure:
- **Render**: Hosting
- **Supabase**: Authentication, CDN/Object Storage, Postgres DB

### APIs and Databases:
- **APIs**: Flask REST APIs
- **Databases**: PostgreSQL for Application and User Data

### Third-Party Services and Integrations:
- **Supabase**: For authentication.
- **AI APIs**: OpenAI GPT for prompt recommendation.

### Version Control and Collaboration:
- **GitHub/GitLab**: For source control and CI/CD pipelines.

---

## Conclusion

FashioNXT is revolutionizing the online fashion industry by merging AI with personalized shopping. It helps both consumers and retailers enjoy a better shopping experience, reduced returns, and increased revenue. Through smart recommendations and innovative virtual try-on features, FashioNXT is shaping the future of fashion commerce.

---

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/Vikas-swe/FashioNXT.git
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    npm install
    ```

3. Start the application:
    ```bash
    python app.py
    npm run dev
    ```


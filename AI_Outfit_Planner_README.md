# 👗 AI Outfit Planner for All Styles  
### “Your Personal AI Stylist — For Every Mood, Generation, and Event”

---

## 🧠 Overview  
**AI Outfit Planner for All Styles** is an AI-powered mobile/web application that helps users pick the perfect outfit for any occasion — whether it’s a presentation, party, or casual outing.  
It scans your wardrobe, detects clothing items, and suggests matching combinations based on **style, color, and occasion preferences**.

This project blends **Computer Vision**, **Machine Learning**, and **Fashion Intelligence** to make styling smart, personalized, and fun.

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React / React Native | Sleek, responsive user interface |
| **Backend** | FastAPI / Flask | API endpoints for image upload & model inference |
| **AI Model** | YOLOv8 + TensorFlow / PyTorch | Detect clothing items & extract visual features |
| **Recommendation Engine** | Cosine Similarity / CNN Embeddings | Suggest best outfit combinations |
| **Database** | Firebase / MongoDB | Store wardrobe data, user preferences, and outfit suggestions |
| **Hosting / Cloud** | Render / Vercel / Hugging Face Spaces | Deploy backend & web app |
| **Optional Add-ons** | OpenAI API / Gemini / Streamlit | Conversational “AI Stylist” assistant |

---

## 🧱 Core Features

### 👕 1. Wardrobe Upload  
- Upload or capture your outfit images.  
- YOLOv8 detects items (shirt, jeans, dress, shoes, etc.).  
- Saves labeled clothes to your digital wardrobe.

### 👗 2. Smart Outfit Generator  
- Choose an event or mood (“Formal”, “Party”, “Casual”).  
- AI suggests matching outfits with color and style balance.  
- Uses clothing embeddings & color harmony analysis.

### 🧢 3. Visual Outfit Preview  
- Generates a collage of the selected outfit (using OpenCV/PIL).  
- Displays suggestions like *“Pair this blazer with white sneakers.”*

### 💬 4. AI Chat Stylist *(Bonus)*  
- Ask: “What should I wear for a college fest?”  
- NLP-based chatbot or OpenAI API gives style advice.

---

## ⚙️ Bonus Features
- 🌤️ Weather-based outfit suggestions (via OpenWeather API).  
- ❤️ “Outfit of the Day” with random generation.  
- 🧵 User outfit ratings and feedback.  
- 🤳 Future upgrade: Virtual try-on (body scanning or AR overlay).  

---

## ⏱️ 24-Hour Hackathon Plan

### 🕐 **Hour 0–3 — Setup**
- Initialize GitHub repo & folder structure.  
- Set up FastAPI backend + React frontend.  
- Integrate YOLOv8 pretrained model for clothing detection.

### 🕓 **Hour 4–8 — Wardrobe Upload System**
- Build image upload & detection API.  
- Test YOLOv8 on uploaded images.  
- Save results (category, color, file URL) to database.

### 🕗 **Hour 9–14 — Outfit Recommendation Engine**
- Implement pairing logic using:
  - Category compatibility (shirt + jeans + shoes).
  - Color harmony detection using OpenCV.
  - Cosine similarity on clothing embeddings.

### 🕓 **Hour 15–18 — Frontend & Display**
- Build React interface:
  - Upload screen.
  - Wardrobe grid display.
  - Outfit suggestion carousel.

### 🕕 **Hour 19–22 — Optional AI Chat Stylist**
- Integrate conversational assistant with OpenAI or Gemini API.  
- Add voice or text chat interface.

### 🕛 **Hour 23–24 — Final Touches & Demo**
- UI polish and bug fixes.  
- Deploy backend (Render/Vercel).  
- Prepare 2-minute live demo & pitch slides.

---

## 📁 Project Structure

```
AI-Outfit-Planner/
│
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── routes/
│   │   ├── detect.py             # YOLOv8 detection endpoint
│   │   ├── recommend.py          # Outfit recommendation logic
│   │   └── chatbot.py            # (Optional) AI stylist chat route
│   ├── models/
│   │   ├── yolov8_model.py       # YOLOv8 integration script
│   │   └── embeddings.py         # Feature extraction for similarity
│   ├── utils/
│   │   ├── color_match.py        # Color harmony detector
│   │   ├── collage_maker.py      # Generates outfit preview images
│   │   └── database.py           # MongoDB / Firebase helper
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.js                # Main React entry
│   │   ├── components/
│   │   │   ├── UploadPage.jsx
│   │   │   ├── WardrobeGrid.jsx
│   │   │   ├── OutfitSuggestion.jsx
│   │   │   └── ChatStylist.jsx
│   │   └── utils/
│   │       └── api.js            # Connects frontend to backend APIs
│   ├── package.json
│   └── README.md
│
├── dataset/
│   ├── sample_wardrobe/          # Sample input images
│   └── labels.json               # YOLOv8 class labels
│
├── docs/
│   ├── architecture.png          # System architecture diagram
│   ├── flowchart.png             # Feature workflow diagram
│   └── pitch_deck.pdf            # Hackathon presentation slides
│
└── README.md                     # (This file)
```

---

## 🧰 Setup & Run Locally

### 1️⃣ Clone the repo
```bash
git clone https://github.com/yourusername/AI-Outfit-Planner.git
cd AI-Outfit-Planner
```

### 2️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4️⃣ Access the app
Go to 👉 `http://localhost:3000`

---

## 🧩 API Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/detect` | POST | Upload image & detect clothing items |
| `/recommend` | GET | Generate outfit suggestions |
| `/chat` | POST | AI stylist (chatbot-based suggestions) |

---

## 🧠 Future Scope
- Integrate AR/VR try-on with real-time outfit overlay.  
- Use Generative AI to *create new outfit designs*.  
- Social sharing — compare looks with friends.  
- Cloud-based wardrobe sync across devices.  



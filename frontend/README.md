# AI Outfit Planner 👗✨

A Progressive Web App (PWA) that serves as your personal AI-powered fashion stylist. Upload your wardrobe, get intelligent outfit recommendations, and chat with an AI stylist for personalized fashion advice.

## 🌟 Features

### Phase 1 (Current) - Core Layout & Navigation ✅
- ✅ Responsive navigation with header, sidebar, and bottom nav
- ✅ Modern glassmorphism UI design
- ✅ PWA configuration with offline support
- ✅ Complete routing structure
- ✅ Reusable component library (Button, Card, Input, Modal)
- ✅ Error boundary and loading states

### Upcoming Features
- 📸 Image upload with drag-and-drop
- 🎨 AI-powered clothing detection (YOLOv8)
- ✨ Smart outfit recommendations
- 💬 AI chat stylist
- 🌤️ Weather-based suggestions
- 📅 Outfit calendar
- 🔐 User authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingSpinner.tsx
│   └── layout/          # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── BottomNav.tsx
│       └── Layout.tsx
├── pages/               # Page components
│   ├── Home.tsx
│   ├── Wardrobe.tsx
│   ├── Outfits.tsx
│   ├── Chat.tsx
│   ├── Profile.tsx
│   └── NotFound.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#a855f7 to #9333ea)
- **Accent**: Pink gradient (#e879f9 to #c026d3)
- **Background**: Gradient from purple-50 via white to pink-50

### Components
- **Glass Cards**: Frosted glass effect with backdrop blur
- **Buttons**: Primary, Secondary, and Outline variants
- **Inputs**: Rounded design with focus states
- **Modals**: Centered with backdrop blur

## 📱 Responsive Design

- **Mobile**: Bottom navigation, single column layouts
- **Tablet**: Sidebar navigation, grid layouts
- **Desktop**: Full sidebar, multi-column layouts

## 🔄 Development Phases

- ✅ **Phase 1**: Project setup and core layout
- 🚧 **Phase 2**: Image upload and wardrobe management
- ⏳ **Phase 3**: Outfit recommendation interface
- ⏳ **Phase 4**: AI chat stylist
- ⏳ **Phase 5**: Authentication
- ⏳ **Phase 6**: AI model integration
- ⏳ **Phase 7**: Recommendation engine
- ⏳ **Phase 8**: Third-party integrations
- ⏳ **Phase 9**: Optimization and deployment

## 📄 License

This project is built for the CBIT Hackathon 2025.

## 🤝 Contributing

This is a hackathon project. For collaboration, please reach out to the team.

---

Made with ❤️ for CBIT Hackathon 2025

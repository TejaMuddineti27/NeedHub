# NeedHub — AI-Powered Community Marketplace & Service Platform

NeedHub is a unified full-stack community marketplace and service platform combining e-commerce, on-demand local services, freelance gigs, social community feeds, and intelligent business tooling powered by Google Gemini.

---

## 🌟 Key Features

### 🛒 1. Customer Shopping & Services
- **Multi-Category Catalog**: Physical goods, handmade crafts, organic farm produce, second-hand items, digital goods, and local home services.
- **Local Service Booking**: Direct appointment scheduling with customizable time slots, address specifications, and service history tracking.
- **Direct Seller Communication**: WhatsApp-style live real-time chat with custom price negotiation, proposal making, and instant offer acceptance.
- **Interactive Order Tracking**: Real-time order progress timeline with OTP-based secure delivery confirmation and escrow protection.
- **Social Commerce & Stories**: Ephemeral merchant stories, community discussion feed, and multimedia posts with upvoting and commenting.

### 🤖 2. Gemini AI Assistant & Tools
- **NeedHub AI Shopping Advisor**: Server-side Gemini 3.6 Flash assistant with multi-turn conversation context, speech-to-text voice dictation, and smart catalog awareness.
- **AI Seller Studio**: Auto-generates high-converting product descriptions, bullet points, tags, and competitive pricing recommendations.
- **AI Admin Moderation**: Automated content sentiment analysis, fraud flagging, and safety auditing.

### 💼 3. Multi-Role Operating Modes
Switch seamlessly between 5 dedicated operational dashboards:
1. **Customer**: Explore listings, book services, track orders, chat with sellers, and use the AI advisor.
2. **Seller / Provider**: Manage inventory, fulfill orders, review analytics, and generate AI-optimized listings.
3. **Delivery Partner**: View delivery routes, navigate tasks, and complete drops with OTP verification.
4. **Platform Admin**: Monitor revenue, escrow transactions, moderation alerts, and platform metrics.
5. **Architecture Explorer**: Live interactive REST API documentation and system architecture specifications.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React, Recharts, React-Markdown
- **Backend**: Express.js, TypeScript (`tsx` in dev, `esbuild` for production bundling)
- **AI & ML**: `@google/genai` (Gemini 3.6 Flash) with secure server-side proxy architecture
- **Build & Dev Tooling**: Vite 6, esbuild, TypeScript compiler

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- (Optional) `GEMINI_API_KEY` for live AI generation features

### Environment Setup
Create a `.env` file in the root directory (refer to `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation
```bash
npm install
```

### Development Server
Start both the Express backend and Vite frontend dev server on port 3000:
```bash
npm run dev
```

### Production Build
Compile client assets and server bundle:
```bash
npm run build
npm start
```

### Type Checking & Linting
```bash
npm run lint
```

---

## 📂 Project Structure

```
├── server.ts                 # Express backend with Gemini API proxy & REST endpoints
├── metadata.json             # Application metadata and platform capabilities
├── src/
│   ├── App.tsx               # Main application controller and role orchestrator
│   ├── main.tsx              # React client entry point
│   ├── types.ts              # Global TypeScript interfaces and data models
│   ├── components/           # UI components, modals, and role dashboards
│   │   ├── AIAssistantDrawer.tsx       # Gemini AI shopping chat drawer
│   │   ├── CustomerHome.tsx            # Customer marketplace interface
│   │   ├── SellerDashboard.tsx         # Merchant and seller control panel
│   │   ├── DeliveryDashboard.tsx       # Courier and logistics portal
│   │   ├── AdminDashboard.tsx          # System administration and moderation
│   │   ├── ArchitectureExplorer.tsx    # Live API specification explorer
│   │   ├── WhatsAppChatModal.tsx       # Direct seller-buyer live chat
│   │   ├── ProductDetailModal.tsx      # Rich product view & review section
│   │   ├── ServiceBookingModal.tsx     # Appointment slot scheduling
│   │   └── CartCheckoutModal.tsx       # Multi-step checkout & payment
│   └── data/
│       └── initialData.ts    # Seed catalog, users, orders, and API specifications
```

---

## 🔒 Security & Architecture
- **Server-Side API Keys**: All Gemini API interactions are encapsulated in `/api/ai/*` backend endpoints. No API keys or secrets are exposed to the client.
- **Escrow Transaction Model**: Customer payments are protected until order completion or OTP verification.

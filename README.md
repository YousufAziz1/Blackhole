# ⚫ Blackhole — Creator Quest Platform on Bags.fm

> **Engage your community. Run campaigns. Reward your holders.**  
> Built for the Bags Hackathon 2025 on Solana.

[![Live Demo](https://img.shields.io/badge/Live-Demo-6c63ff?style=for-the-badge)](https://blackhole.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Blackhole-black?style=for-the-badge&logo=github)](https://github.com/YousufAziz1/Blackhole)
[![Built on Bags](https://img.shields.io/badge/Built%20on-Bags.fm-orange?style=for-the-badge)](https://bags.fm)

---

## 🚀 What is Blackhole?

**Blackhole** is a **token-gated quest and campaign platform** built natively on Bags.fm. It lets creators and token launchers run structured engagement campaigns — similar to Galxe or Zealy — but **exclusively for Solana tokens launched on Bags.fm**.

If you're a creator on Bags.fm and want to grow your community, reward your holders, and run viral X (Twitter) campaigns, Blackhole is your tool.

---

## 🎯 Problem We Solve

Most Bags.fm creators have no structured way to:
- Run community growth campaigns
- Reward early holders for engagement
- Verify on-chain token ownership before rewarding fans
- Manage submissions and approvals transparently

**Blackhole** solves all of this in one platform.

---

## ✨ Features

### For Creators
- 🔐 **Phantom Wallet Login** — Secure creator authentication via Solana wallet
- 📝 **Quest Creation** — Single-task or Multi-Task Campaign mode
- 🏆 **Reward System** — Set reward per spot, max completions, deadline
- ✅ **Approval Dashboard** — Review & approve fan submissions with full wallet visibility
- 🔗 **Share Quest Links** — Direct shareable URLs for fan campaigns
- 🤖 **AI Quest Ideas** — Gemini AI suggests best quests for your token's holder count

### For Fans
- 🎮 **Simple Mode** — No wallet needed, just X username + wallet address
- ⚡ **Web3 Mode** — Phantom wallet connect + message signing
- ✅ **Multi-Task Checklist** — Step-by-step task verification (like Galxe)
- 🔍 **Verify Button** — Confirms task completion before submission unlock
- 🟡🟢🔴 **Status Badges** — Pending / Approved / Rejected submission states

### Bags.fm Integration
- 📦 **`@bagsfm/bags-sdk`** imported and used for **live token data fetching**
- 🔍 **Live Holder Count** displayed on every quest page fetched from Bags SDK
- 💰 **Token Supply** pulled from Solana Mainnet via SDK
- 🔗 **Direct Bags.fm profile links** on every quest
- 🔐 **Token ownership verification** using checkHolding (BagsSDK + SPL)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS + Custom Design System |
| Wallet | Solana Wallet Adapter (Phantom) |
| Blockchain | Solana Mainnet |
| Bags Integration | `@bagsfm/bags-sdk` |
| AI | Google Gemini API (Quest Ideas) |
| Storage | localStorage (demo) |
| Deployment | Vercel |

---

## 🔗 Bags SDK Integration

```ts
import { BagsSDK } from '@bagsfm/bags-sdk';

// Initialize with Solana Mainnet connection
const sdk = new BagsSDK(apiKey, connection);

// Fetch live token holder count on every quest page
const tokenInfo = await getTokenInfo(quest.tokenMint);
// → Returns: { holderCount: 1842, supply: 1000000000, ... }

// Verify fan holds the token before marking as approved
const isHolder = await checkHolding(fanWallet, tokenMint, minAmount);
```

Every Quest page calls the **Bags SDK live** and displays:
- ✅ Token Name & Symbol (Bags verified)
- 📊 Live Holder Count
- 💰 Token Supply
- 🔗 Direct link to Bags.fm creator profile

---

## 🎬 User Flow

```
Creator                              Fan
───────                              ───
1. Connect Phantom Wallet      →   Browse Quests (no wallet needed)
2. Create Quest (Single/Multi) →   Open Quest → See Bags Verified badge
3. Set Reward + Deadline       →   Complete Tasks (with checklist)
4. Share Quest Link            →   Click Verify → Submit Proof
5. Review Submissions          →   Wait for Approval (status badge)
6. Approve + Pay Fan           →   Receive tokens to their wallet
```

---

## 📦 Installation

```bash
# Clone
git clone https://github.com/YousufAziz1/Blackhole.git
cd Blackhole

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Add your VITE_GEMINI_API_KEY

# Run locally
pnpm dev
```

---

## 🌐 Environment Variables

```env
# .env (never commit this file)
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── QuestCard.tsx          # Quest display with share button
│   ├── QuestForm.tsx          # Create/edit quests (single + multi-task)
│   ├── ProofSubmitForm.tsx    # Fan submission (Simple + Web3 modes)
│   ├── AIQuestSuggest.tsx     # Gemini AI quest idea generator
│   └── ui.tsx                 # Design system components
├── pages/
│   ├── Home.tsx               # Landing page
│   ├── CreatorDashboard.tsx   # Creator management panel
│   ├── FanDashboard.tsx       # Fan quest browser
│   └── QuestDetail.tsx        # Individual quest + Bags SDK panel
├── utils/
│   ├── bags.ts                # BagsSDK integration
│   ├── gemini.ts              # AI quest generation
│   └── storage.ts             # localStorage helpers
└── types.ts                   # TypeScript interfaces
```

---

## 🏆 Hackathon Track

**Category:** Creator Tools / Community Growth  
**Token:** [Your Bags.fm Token Link]

---

## 👤 Builder

**Yousuf** — Indie Hacker, AI + Web3 Builder  
X: [@YousufWeb3AI](https://x.com/YousufWeb3AI)  
Built for the **Bags Hackathon 2025**

---

*"Blackhole — Where creator communities get swallowed into engagement"* ⚫

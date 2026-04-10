# LIFEX Mobile App — Living Engineering Spec
Version: 0.3 | Last Updated: 2026-04-09 | Stack: React Native + Expo

## Overview
Personal financial OS mobile companion for the LIFEX platform.
Single user (Karthikeyan). Voice-first expense capture + portfolio dashboard + trading monitor.

## Repo
github.com/theboringtrader14/lifex-mobile
Local: ~/STAXX/lifex-mobile/
Expo Dev: localhost:8081

## Build Status
- iOS: Running on Expo Go / simulator
- Android: EAS build completed 2026-04-08
- Production: Not deployed to App Store / Play Store yet

## Tech Stack
Framework: React Native 0.74 + Expo SDK 51
Navigation: Expo Router (file-based)
State: Zustand (installed, not fully used)
Voice output: expo-speech (installed, not wired)
Voice input: @react-native-voice/voice (installed, NOT wired)
Audio: expo-av (installed, NOT wired)
Animations: react-native-reanimated
Blur / glass: expo-blur
Auth: JWT in expo-secure-store
HTTP: axios

## Backend Connections
STAAX:  dev=localhost:8000  prod=api.lifexos.co.in
INVEX:  dev=localhost:8001  prod=invex.lifexos.co.in
BUDGEX: dev=localhost:8002  prod=budgex-api.lifexos.co.in

## Design Tokens
Background:   #0A0A0B
Surface:      rgba(18,18,20,0.92)
Border:       rgba(255,107,0,0.18)
Orange:       #FF6B00 (primary/STAAX)
Teal:         #00C9A7 (INVEX)
Green:        #22DD88 (profit)
Red:          #FF4444 (loss/errors)
Font display: Syne
Font mono:    JetBrains Mono
Font body:    Inter

## Screens (5 tabs)

### 1. Home (index.tsx)
3 widget cards: Net Worth (INVEX) / Trading P&L (STAAX) / Expenses (BUDGEX)
AI voice section: mic button, transcript display, send/clear
Voice flow: tap mic -> record -> transcribe -> parse -> confirm -> save expense
APIs: GET /mobile/dashboard (STAAX), GET /portfolio/summary (INVEX), GET /expenses/summary (BUDGEX)

### 2. Portfolio (portfolio.tsx)
Total portfolio value, day change, XIRR
Holdings table (top stocks)
Asset breakdown bar
API: GET /portfolio/summary + /portfolio/holdings (INVEX)

### 3. Trading (trading.tsx)
Today P&L + FY P&L
Active algos, waiting, error counts
Open positions list + recent trades
API: GET /system/stats + /orders/ + /algos/ (STAAX)

### 4. Budget (budget.tsx)
Monthly spend vs budget
Category breakdown + recent expenses
API: GET /expenses/summary (BUDGEX)

### 5. AI (ai.tsx)
Text + voice chat with LIFEX AI (Gemma 4)
Suggested questions + typing indicator
API: POST /api/v1/ai/analyze (STAAX)

## Start Command
cd ~/STAXX/lifex-mobile && npx expo start

## Critical Issues (QA Audit 2026-04-07 + 2026-04-09)

C1: Voice/mic not wired -- MicButton onPress is empty no-op, expo-av never imported
C2: BUDGEX /parse endpoint never called -- expense parser completely bypassed
C3: createExpense() has no auth header -- POST /api/v1/expenses/ always 401, nothing ever saved
C4: Field mismatch: total_value vs total_portfolio_value (INVEX) -- Net Worth widget shows ...
C5: Field mismatch: monthly_total vs monthly (BUDGEX) -- Monthly spend shows ...
C6: expenses.monthly hardcoded to 0 in mobile.py -- Dashboard always shows 0 expenses
C7: Open positions section ignores fetched orders -- always shows No open positions today

## High Priority Issues

H1: No speech-to-text library wired (expo-av + @react-native-voice installed but unused)
H2: Silent failures on 4 of 5 screens -- empty catch blocks, no user feedback
H3: Hardcoded mock data: portfolio holdings, category breakdown, recent expenses
H4: No loading states (except AI screen)
H5: Budget chart hardcoded SVG path, not real data
H6: PUSH button dead -- no-op callback in production
H7: Send button on AI screen shows mic icon -- misleading

## Medium Priority Issues

M1: Good morning greeting hardcoded regardless of time of day
M2: PRACTIX/LIVE badge hardcoded as PRACTIX
M3: ROI % hardcoded as 0.02%
M4: No request timeout or retry logic anywhere
M5: No shared data cache -- re-fetches on every tab switch

## Pending Features

### Voice Flow (not implemented)
1. Wire MicButton.onPress to expo-av recording
2. Request microphone permission
3. Integrate STT (Google Speech / Gemini)
4. Call parseExpense() to BUDGEX /api/v1/parse
5. Show confirmation: Swiggy 350 Food -- Confirm?
6. POST /api/v1/expenses with x-api-key auth header on save

### Push Notifications (not implemented)
Register Expo push token via POST /api/v1/mobile/register-push
Wire GET /api/v1/notifications for unread badge
Show notifications for: SL hit, TP hit, algo error, entry missed, budget overrun

### Three.js Avatar
For FINEX dashboard web (not mobile app)
Animated avatar for LIFEX landing/FINEX page

### Data Layer Fixes (all screens)
Fix all field name mismatches (C4, C5, C6, C7)
Remove all hardcoded mock data
Add loading states to all screens
Add error states to all screens
Add Zustand cache to share data across tabs

## File Structure
lifex-mobile/
  app/
    (auth)/login.tsx
    (tabs)/
      index.tsx        -- Home + voice
      portfolio.tsx    -- INVEX data
      trading.tsx      -- STAAX data
      budget.tsx       -- BUDGEX data
      ai.tsx           -- LIFEX AI chat
    _layout.tsx
  src/
    services/api.ts    -- All API calls
    config.ts          -- URLs + env
    components/
      MicButton.tsx
  LIFEX_MOBILE_LIVING_SPEC.md

## Roadmap
Phase 1 -- Fix data layer: field mismatches, remove mocks, add error/loading states
Phase 2 -- Voice flow: recording, STT, BUDGEX parse, confirmation UI, expense save
Phase 3 -- Push notifications: Expo push tokens, FCM, algo event alerts
Phase 4 -- Polish: Zustand cache, retry logic, biometric auth, offline mode

## Session Update 2026-04-10

### Completed
- Start Session button wired in trading.tsx (inactive/starting/active states)
- registerPushToken() added to api.ts
- getNotifications() added to api.ts  
- startSession() added to api.ts
- Backend: GET /api/v1/mobile/session/status endpoint
- Backend: POST /api/v1/mobile/register-push endpoint
- Backend: GET /api/v1/mobile/notifications endpoint (reads event_log)
- Backend: push_sender.py fire-and-forget Expo push via exp.host API
- Backend: algo_runner.py wired push on SL hit, TP hit, entry, missed, error
- Mobile Phase 1 data fixes: auth header, open positions, loading states, greeting
- EAS Android build: complete

### Pending
- notifications.tsx: replace MOCK_NOTIFICATIONS with real API data (frontend)
- trading.tsx: wire sessionStatus to START button states (frontend)
- Voice flow: Phase 2 (STT, parseExpense, confirmation UI, POST /expenses)


## Session Update 2026-04-10

### Completed
- startSession(), checkSessionStatus(), registerPushToken(), getNotifications() added to api.ts
- Backend: GET /api/v1/mobile/session/status (smartstream + token_valid booleans)
- Backend: POST /api/v1/mobile/register-push (saves to push_tokens.json keyed by platform)
- Backend: GET /api/v1/mobile/notifications (reads event_log, maps prefixes to notification types)
- Backend: push_sender.py fire-and-forget Expo push via exp.host API
- Backend: algo_runner.py push wired on SL hit, TP hit, entry fired, entry missed, algo error
- EAS Android build complete (2026-04-08)
- Mobile Phase 1 data fixes: auth header, open positions, loading states, greeting

### Pending Frontend Wiring (Karthik to wire)
- trading.tsx: wire sessionStatus to START button (inactive/starting/active visual states)
- trading.tsx: call checkSessionStatus() on mount
- trading.tsx: call registerPushToken() once on session active
- notifications.tsx: replace MOCK_NOTIFICATIONS with getNotifications() real API data

### Pending Features
- Voice flow Phase 2: STT, parseExpense, confirmation UI, POST /expenses
- Push notification received handler on device

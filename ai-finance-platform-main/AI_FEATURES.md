# 🤖 AI Features in Your Finance Platform

## Powered by: **Google Gemini AI** (gemini-1.5-flash model)

Your finance platform uses AI in **2 powerful ways**:

---

## 1. 📸 **AI Receipt Scanner** (Main Feature)

### What It Does:
Automatically extracts transaction details from receipt images using computer vision and AI.

### Location:
- **File**: `actions/transaction.js` → `scanReceipt()` function
- **UI Component**: `app/(main)/transaction/_components/recipt-scanner.jsx`
- **Used In**: Transaction creation page (`/transaction/create`)

### How It Works:
1. User uploads a receipt image (photo or scan)
2. Image is converted to base64 format
3. Sent to Google Gemini AI with a prompt
4. AI analyzes the image and extracts:
   - **Amount** - Total transaction amount
   - **Date** - Transaction date
   - **Merchant Name** - Store/vendor name
   - **Description** - Items purchased
   - **Category** - Auto-categorized (groceries, food, shopping, etc.)

### AI Prompt Used:
```
Analyze this receipt image and extract:
- Total amount (just the number)
- Date (in ISO format)
- Description or items purchased (brief summary)
- Merchant/store name
- Suggested category (housing, transportation, groceries, utilities, 
  entertainment, food, shopping, healthcare, education, personal, 
  travel, insurance, gifts, bills, other-expense)
```

### How to Use:
1. Go to `/transaction/create`
2. Click **"Scan Receipt with AI"** button (with camera icon)
3. Upload a receipt image (max 5MB)
4. AI automatically fills in:
   - Amount
   - Date
   - Description
   - Category
   - Merchant name
5. Review and adjust if needed
6. Click "Create Transaction"

### Example Use Cases:
- 🛒 Grocery shopping receipts
- 🍕 Restaurant bills
- ⛽ Gas station receipts
- 🏪 Retail store purchases
- 💊 Pharmacy receipts
- 🎬 Entertainment tickets

---

## 2. 💡 **AI Financial Insights** (Background Feature)

### What It Does:
Analyzes your monthly spending patterns and provides personalized financial advice.

### Location:
- **File**: `lib/inngest/function.js` → `generateFinancialInsights()` function
- **Triggered**: Automatically on the 1st of each month
- **Delivered**: Via console logs (email disabled)

### How It Works:
1. At the end of each month, the system collects:
   - Total income
   - Total expenses
   - Net income (income - expenses)
   - Spending by category
2. Data is sent to Google Gemini AI
3. AI analyzes spending patterns
4. Generates 3 personalized, actionable insights
5. Insights are logged to console (would be emailed if enabled)

### AI Prompt Used:
```
Analyze this financial data and provide 3 concise, actionable insights.
Focus on spending patterns and practical advice.
Keep it friendly and conversational.

Financial Data for [Month]:
- Total Income: $X
- Total Expenses: $Y
- Net Income: $Z
- Expense Categories: [breakdown by category]
```

### Example Insights AI Might Generate:
- "Your grocery spending increased by 20% this month. Consider meal planning to reduce costs."
- "Great job! You stayed under budget in entertainment. Keep it up!"
- "Your transportation costs are high. Look into carpooling or public transit options."
- "You're saving 30% of your income - excellent financial discipline!"
- "Consider setting aside more for your emergency fund based on your expenses."

### When It Runs:
- **Automatically**: 1st day of every month at midnight
- **Background Job**: Powered by Inngest
- **No User Action Required**: Runs automatically

---

## 🎯 AI Configuration

### API Key:
Your Gemini API key is configured in `.env`:
```env
GEMINI_API_KEY=AIzaSyDpM_q6qM_8wyziWo0XtYC03Wlsdy2Fnfc
```

### Model Used:
- **Model**: `gemini-1.5-flash`
- **Provider**: Google AI (Gemini)
- **Capabilities**: 
  - Image analysis (receipt scanning)
  - Text generation (financial insights)
  - JSON output formatting

---

## 📊 AI Feature Comparison

| Feature | Receipt Scanner | Financial Insights |
|---------|----------------|-------------------|
| **Type** | Computer Vision + NLP | Data Analysis + NLP |
| **Trigger** | User uploads image | Automatic (monthly) |
| **Input** | Receipt image | Transaction data |
| **Output** | Transaction details | 3 actionable insights |
| **User Interaction** | Manual | Automatic |
| **Frequency** | On-demand | Monthly |
| **Location** | Transaction page | Background job |

---

## 🔍 Where to See AI in Action

### Receipt Scanner:
1. **Navigate to**: http://localhost:3000/transaction/create
2. **Look for**: Button with camera icon saying "Scan Receipt with AI"
3. **Try it**: Upload any receipt image
4. **Watch**: Form fields auto-fill with extracted data

### Financial Insights:
1. **Automatic**: Runs on 1st of each month
2. **Check logs**: Look in server console for insights
3. **Future**: Would be sent via email (currently disabled)

---

## 💰 Cost & Limits

### Gemini API:
- **Free Tier**: 60 requests per minute
- **Cost**: Free for moderate usage
- **Limits**: Check your Google AI Studio dashboard

### Receipt Scanning:
- **File Size Limit**: 5MB per image
- **Supported Formats**: JPG, PNG, HEIC, WebP
- **Processing Time**: 2-5 seconds per receipt

---

## 🚀 Future AI Enhancements (Potential)

1. **Smart Categorization**: AI learns from your categorization patterns
2. **Spending Predictions**: Forecast future expenses based on history
3. **Budget Recommendations**: AI suggests optimal budget amounts
4. **Anomaly Detection**: Alert on unusual spending patterns
5. **Bill Reminders**: AI predicts upcoming bills based on patterns
6. **Investment Advice**: Personalized savings recommendations
7. **Voice Commands**: "Add $50 grocery expense" via voice
8. **Chat Assistant**: Ask questions about your finances

---

## 🎨 AI UI Elements

### Receipt Scanner Button:
```jsx
<Button className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500">
  <Camera className="mr-2" />
  Scan Receipt with AI
</Button>
```

### Loading State:
```jsx
<Loader2 className="animate-spin" />
Scanning Receipt...
```

### Success Message:
```
✅ Receipt scanned successfully
```

---

## 🔧 Technical Details

### Libraries Used:
- `@google/generative-ai` - Google Gemini AI SDK
- `Buffer` - Image to base64 conversion
- `inngest` - Background job scheduling

### API Calls:
```javascript
// Initialize AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate content
const result = await model.generateContent([prompt, imageData]);
```

---

## ✨ Summary

**AI is integrated in 2 key areas:**

1. **🎯 Receipt Scanner** - User-facing, on-demand feature
   - Saves time entering transaction details
   - Reduces manual data entry errors
   - Makes expense tracking effortless

2. **💡 Financial Insights** - Background, automatic feature
   - Provides personalized financial advice
   - Analyzes spending patterns
   - Helps improve financial habits

**Both features use Google Gemini AI to make your finance management smarter and easier!** 🤖💰

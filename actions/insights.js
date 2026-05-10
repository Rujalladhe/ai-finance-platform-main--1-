"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getMonthlyStats(userId, month = new Date()) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}

export async function generateFinancialInsights() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get current month stats
    const currentMonth = new Date();
    const stats = await getMonthlyStats(user.id, currentMonth);

    // If no transactions, return default message
    if (stats.transactionCount === 0) {
      return {
        success: true,
        insights: [
          "Start tracking your expenses to get personalized insights.",
          "Add your first transaction to see AI-powered financial advice.",
          "The more data you add, the better insights you'll receive.",
        ],
        stats: {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          transactionCount: 0,
        },
      };
    }

    const monthName = currentMonth.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // Use Gemini 1.5 Flash for free tier limits
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this financial data and provide 3 concise, actionable insights.
      Focus on spending patterns and practical advice.
      Keep it friendly and conversational.
      Each insight should be 1-2 sentences maximum.

      Financial Data for ${monthName}:
      - Total Income: $${stats.totalIncome.toFixed(2)}
      - Total Expenses: $${stats.totalExpenses.toFixed(2)}
      - Net Income: $${(stats.totalIncome - stats.totalExpenses).toFixed(2)}
      - Number of Transactions: ${stats.transactionCount}
      - Expense Categories: ${Object.entries(stats.byCategory)
        .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
        .join(", ")}

      Format the response as a JSON array of strings, like this:
      ["insight 1", "insight 2", "insight 3"]
      
      Make the insights specific to the data provided. If spending is high in a category, mention it. If they're saving well, praise them. Be helpful and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    let insights;
    try {
      insights = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      insights = [
        "Your financial data is being analyzed.",
        "Keep tracking your expenses for better insights.",
        "Review your spending categories to identify savings opportunities.",
      ];
    }

    return {
      success: true,
      insights,
      stats: {
        totalIncome: stats.totalIncome,
        totalExpenses: stats.totalExpenses,
        netIncome: stats.totalIncome - stats.totalExpenses,
        transactionCount: stats.transactionCount,
        topCategory: Object.entries(stats.byCategory).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0],
      },
    };
  } catch (error) {
    console.error("Error generating insights:", error);
    return {
      success: false,
      error: error.message,
      insights: [
        "Unable to generate insights at this time.",
        "Please try again later.",
        "Make sure you have some transactions recorded.",
      ],
    };
  }
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { generateFinancialInsights } from "@/actions/insights";
import { toast } from "sonner";

export function AIInsights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleGenerateInsights = async () => {
    setLoading(true);
    try {
      const result = await generateFinancialInsights();
      if (result.success) {
        setInsights(result.insights);
        setStats(result.stats);
        toast.success("AI insights generated!");
      } else {
        toast.error(result.error || "Failed to generate insights");
      }
    } catch (error) {
      toast.error("Failed to generate insights");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Financial Insights
          </CardTitle>
          <Button
            onClick={handleGenerateInsights}
            disabled={loading}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!insights && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <p className="text-sm">
              Click "Generate Insights" to get AI-powered financial advice based on your spending patterns.
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-purple-600" />
            <p className="text-sm text-muted-foreground">
              AI is analyzing your financial data...
            </p>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-4">
            {/* Stats Summary */}
            {stats && stats.transactionCount > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium">Income</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ${stats.totalIncome.toFixed(0)}
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-xs font-medium">Expenses</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ${stats.totalExpenses.toFixed(0)}
                  </p>
                </div>
                <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-medium">Net</span>
                  </div>
                  <p className={`text-lg font-bold ${stats.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ${stats.netIncome.toFixed(0)}
                  </p>
                </div>
              </div>
            )}

            {/* AI Insights */}
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-gray-900/70 rounded-lg p-4 border border-purple-200 dark:border-purple-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                      {insight}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Regenerate Button */}
            <div className="pt-2">
              <Button
                onClick={handleGenerateInsights}
                variant="outline"
                size="sm"
                className="w-full border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950/30"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Regenerate Insights
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

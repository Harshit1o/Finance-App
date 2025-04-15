
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useFinance } from '@/context/FinanceContext';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Transaction } from '@/types/finance';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  date: string;
  expense: number;
}

export function MonthlyExpenseChart() {
  const { transactions } = useFinance();
  
  // Prepare data
  const now = new Date();
  const firstDay = startOfMonth(now);
  const lastDay = endOfMonth(now);
  
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  // Initialize data with all days of current month
  const initialData: ChartData[] = days.map(day => ({
    date: format(day, 'yyyy-MM-dd'),
    expense: 0,
  }));
  
  // Group expense transactions by date
  const expensesByDate = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction: Transaction) => {
      // Only include transactions from current month
      const transactionDate = parseISO(transaction.date);
      if (transactionDate >= firstDay && transactionDate <= lastDay) {
        const dateStr = transaction.date;
        acc[dateStr] = (acc[dateStr] || 0) + transaction.amount;
      }
      return acc;
    }, {});
  
  // Merge with initialized data
  const chartData = initialData.map(item => ({
    ...item,
    expense: expensesByDate[item.date] || 0,
  }));
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const dateLabel = format(parseISO(label), 'MMM dd');
      return (
        <div className="custom-tooltip bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{dateLabel}</p>
          <p className="text-expense-foreground">
            Expenses: {formatCurrency(payload[0].value as number)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), 'dd')}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                width={50}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="expense" 
                fill="#9b87f5" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell, LabelList } from 'recharts';
import { useFinance } from '@/context/FinanceContext';
import { formatMonthYear, formatCurrency, getCurrentMonthYear } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetComparisonItem {
  category: string;
  budget: number;
  actual: number;
  color: string;
  status: 'under' | 'over' | 'on-track';
  percentage: number;
}

export function BudgetComparisonChart() {
  const { transactions, categories, budgets } = useFinance();
  const currentMonth = getCurrentMonthYear();
  
  // Get current month's budgets
  const currentBudgets = budgets.filter(budget => budget.month === currentMonth);
  
  // Calculate actual spending by category for current month
  const actualByCategory = transactions
    .filter(t => {
      // Only include expenses from current month
      const transactionMonth = t.date.substring(0, 7);
      return transactionMonth === currentMonth && t.type === 'expense';
    })
    .reduce((acc: Record<string, number>, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
  
  // Prepare data for comparison chart
  const chartData: BudgetComparisonItem[] = currentBudgets.map(budget => {
    const category = categories.find(c => c.id === budget.categoryId);
    const actual = actualByCategory[budget.categoryId] || 0;
    const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
    
    let status: 'under' | 'over' | 'on-track' = 'under';
    if (actual > budget.amount) {
      status = 'over';
    } else if (actual === budget.amount) {
      status = 'on-track';
    }
    
    return {
      category: category ? category.name : 'Unknown',
      budget: budget.amount,
      actual: actual,
      color: category ? category.color : '#999',
      status,
      percentage: parseFloat(percentage.toFixed(0)),
    };
  }).sort((a, b) => b.percentage - a.percentage);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{data.category}</p>
          <p>Budget: {formatCurrency(data.budget)}</p>
          <p>Actual: {formatCurrency(data.actual)}</p>
          <p className={`font-medium ${
            data.status === 'over' 
              ? 'text-destructive' 
              : data.status === 'on-track' 
                ? 'text-primary' 
                : 'text-green-600'
          }`}>
            {data.percentage}% {
              data.status === 'over' 
                ? '(over budget)' 
                : data.status === 'on-track' 
                  ? '(on budget)' 
                  : '(under budget)'
            }
          </p>
        </div>
      );
    }
    return null;
  };
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual Spending</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No budget data available for {formatMonthYear(currentMonth)}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending for {formatMonthYear(currentMonth)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `$${value}`} 
              />
              <YAxis 
                type="category" 
                dataKey="category" 
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="budget" 
                name="Budget" 
                fill="#9b87f5" 
                opacity={0.3} 
                radius={[0, 4, 4, 0]} 
              />
              <Bar 
                dataKey="actual" 
                name="Actual" 
                radius={[0, 4, 4, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === 'over' ? '#f87171' : '#9b87f5'} 
                  />
                ))}
                <LabelList 
                  dataKey="percentage" 
                  position="right" 
                  formatter={(value: number) => `${value}%`} 
                />
              </Bar>
              <ReferenceLine 
                x={0} 
                stroke="#666" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

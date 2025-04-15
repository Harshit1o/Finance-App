
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps, Legend } from 'recharts';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export function CategoryPieChart() {
  const { transactions, categories } = useFinance();
  
  // Group transactions by category (expenses only)
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});
  
  // Prepare data for pie chart
  const chartData: ChartData[] = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category ? category.name : 'Uncategorized',
      value: amount,
      color: category ? category.color : '#999',
    };
  });
  
  // Sort data from highest to lowest
  chartData.sort((a, b) => b.value - a.value);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background p-3 border rounded-md shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-expense-foreground">
            {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Custom legend renderer
  const renderLegend = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-[150px] overflow-auto">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs truncate">{entry.name}</span>
            <span className="text-xs ml-1 text-muted-foreground">
              ({formatCurrency(entry.value)})
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {renderLegend()}
      </CardContent>
    </Card>
  );
}

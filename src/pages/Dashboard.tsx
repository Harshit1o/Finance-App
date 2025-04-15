
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MonthlyExpenseChart } from '@/components/charts/MonthlyExpenseChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/utils/dateUtils';
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionList } from '@/components/transactions/TransactionList';

export default function Dashboard() {
  const { summary, transactions } = useFinance();
  
  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
    
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" size="sm">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Total Balance"
            value={formatCurrency(summary.balance)}
            description={summary.balance >= 0 ? "You're doing great!" : "You're spending more than you earn"}
            icon={DollarSign}
            className={cn(
              "border-l-4",
              summary.balance >= 0 ? "border-l-green-500" : "border-l-red-500"
            )}
          />
          
          <DashboardCard
            title="Income"
            value={formatCurrency(summary.totalIncome)}
            description={`${transactions.filter(t => t.type === 'income').length} income transactions`}
            icon={ArrowUpIcon}
            className="border-l-4 border-l-income-foreground"
            iconClassName="bg-income text-income-foreground"
          />
          
          <DashboardCard
            title="Expenses"
            value={formatCurrency(summary.totalExpense)}
            description={`${transactions.filter(t => t.type === 'expense').length} expense transactions`}
            icon={ArrowDownIcon}
            className="border-l-4 border-l-expense-foreground"
            iconClassName="bg-expense text-expense-foreground"
          />
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonthlyExpenseChart />
          <CategoryPieChart />
        </div>
        
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/transactions">View All</a>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "p-2 rounded-full",
                        transaction.type === 'income' 
                          ? "bg-income text-income-foreground" 
                          : "bg-expense text-expense-foreground"
                      )}>
                        {transaction.type === 'income' 
                          ? <ArrowUpIcon className="h-4 w-4" /> 
                          : <ArrowDownIcon className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "font-medium",
                      transaction.type === 'income' 
                        ? "text-income-foreground" 
                        : "text-expense-foreground"
                    )}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No transactions yet. Add some transactions to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

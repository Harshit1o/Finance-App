
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BudgetList } from '@/components/budget/BudgetList';
import { BudgetComparisonChart } from '@/components/budget/BudgetComparisonChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Budget() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Budget</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Management</CardTitle>
            <CardDescription>
              Track, compare and manage your monthly budgets across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetComparisonChart />
          </CardContent>
        </Card>
        
        <BudgetList />
      </div>
    </MainLayout>
  );
}

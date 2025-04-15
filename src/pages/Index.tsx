
import React from 'react';
import Dashboard from './Dashboard';
import { useFinance } from '@/context/FinanceContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const Index = () => {
  const { isLoading, transactions, categories } = useFinance();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If there are no transactions or categories, show a welcome screen
  if (transactions.length === 0 || categories.length === 0) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
            <h1 className="text-2xl font-bold">Welcome to Your Personal Finance Tracker</h1>
            <p className="text-muted-foreground">
              Get started by adding your first transaction or creating categories to organize your finances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Button asChild>
                <Link to="/transactions">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/categories">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Categories
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;

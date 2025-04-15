
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Budget } from '@/types/finance';
import { useFinance } from '@/context/FinanceContext';
import { formatMonthYear, formatCurrency, getCurrentMonthYear } from '@/utils/dateUtils';
import { Edit, MoreVertical, Plus, Trash2 } from 'lucide-react';
import { BudgetForm } from './BudgetForm';
import { Progress } from '@/components/ui/progress';

export function BudgetList() {
  const { budgets, categories, transactions, deleteBudget } = useFinance();
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentMonthFilter, setCurrentMonthFilter] = useState(true);
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  const handleEditClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (budgetId: string) => {
    deleteBudget(budgetId);
  };
  
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedBudget(undefined);
  };
  
  // Calculate actual spending for each budget
  const budgetsWithSpending = budgets
    .filter(budget => !currentMonthFilter || budget.month === getCurrentMonthYear())
    .map(budget => {
      const actual = transactions
        .filter(t => {
          const transactionMonth = t.date.substring(0, 7);
          return transactionMonth === budget.month && 
                 t.category === budget.categoryId &&
                 t.type === 'expense';
        })
        .reduce((sum, t) => sum + t.amount, 0);
      
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
      
      return {
        ...budget,
        actual,
        percentage: Math.min(100, percentage),
        status: actual > budget.amount ? 'over' : 'under'
      };
    })
    .sort((a, b) => {
      // Sort by month first (most recent first)
      if (a.month !== b.month) {
        return b.month.localeCompare(a.month);
      }
      // Then sort by percentage (highest first)
      return b.percentage - a.percentage;
    });
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Budgets</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentMonthFilter(!currentMonthFilter)}
          >
            {currentMonthFilter ? 'Show All Months' : 'Show Current Month Only'}
          </Button>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedBudget ? 'Edit Budget' : 'Add Budget'}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm 
              budget={selectedBudget} 
              onSuccess={handleFormSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Actual</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetsWithSpending.length > 0 ? (
              budgetsWithSpending.map((budget) => (
                <TableRow key={budget.id}>
                  <TableCell>{formatMonthYear(budget.month)}</TableCell>
                  <TableCell>{getCategoryName(budget.categoryId)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(budget.amount)}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    budget.status === 'over' ? 'text-destructive' : ''
                  }`}>
                    {formatCurrency(budget.actual)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={budget.percentage} 
                        className={`h-2 ${budget.status === 'over' ? 'bg-red-200' : ''}`}
                        // Custom styling for the indicator
                        style={{
                          '--progress-indicator-color': budget.status === 'over' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
                        } as React.CSSProperties}
                      />
                      <span className="text-xs w-10">
                        {Math.round(budget.percentage)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(budget)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                budget entry.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteClick(budget.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  {currentMonthFilter
                    ? `No budgets for ${formatMonthYear(getCurrentMonthYear())}. Click "Add Budget" to get started.`
                    : 'No budgets yet. Click "Add Budget" to get started.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

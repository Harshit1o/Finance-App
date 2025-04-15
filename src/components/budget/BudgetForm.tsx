
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Budget } from '@/types/finance';
import { useFinance } from '@/context/FinanceContext';
import { getCurrentMonthYear } from '@/utils/dateUtils';

const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: 'Amount must be a positive number' }
  ),
  month: z.string().min(1, 'Month is required'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  budget?: Budget;
  onSuccess?: () => void;
}

export function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const { addBudget, updateBudget, categories } = useFinance();
  
  const defaultValues: Partial<BudgetFormValues> = budget
    ? {
        categoryId: budget.categoryId,
        amount: budget.amount.toString(),
        month: budget.month,
      }
    : {
        month: getCurrentMonthYear(),
      };

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues,
  });

  function onSubmit(data: BudgetFormValues) {
    const budgetData = {
      categoryId: data.categoryId,
      amount: Number(data.amount),
      month: data.month,
    };

    try {
      if (budget) {
        updateBudget({ ...budgetData, id: budget.id });
        toast({
          title: 'Budget updated',
          description: 'Your budget has been updated.',
        });
      } else {
        addBudget(budgetData);
        toast({
          title: 'Budget added',
          description: 'Your budget has been created.',
        });
        form.reset({
          categoryId: '',
          amount: '',
          month: getCurrentMonthYear(),
        });
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  }

  // Filter out the income category
  const expenseCategories = categories.filter(category => 
    category.name.toLowerCase() !== 'income'
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Input type="month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {budget ? 'Update Budget' : 'Add Budget'}
        </Button>
      </form>
    </Form>
  );
}

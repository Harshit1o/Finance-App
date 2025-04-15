
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Transaction } from '@/types/finance';
import { useFinance } from '@/context/FinanceContext';
import { getCurrentMonthYear } from '@/utils/dateUtils';

const transactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    { message: 'Amount must be a positive number' }
  ),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
  const { addTransaction, updateTransaction, categories } = useFinance();
  
  const defaultValues: Partial<TransactionFormValues> = transaction
    ? {
        amount: transaction.amount.toString(),
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
      }
    : {
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
      };

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues,
  });

  function onSubmit(data: TransactionFormValues) {
    const transactionData = {
      amount: Number(data.amount),
      date: data.date,
      description: data.description,
      category: data.category,
      type: data.type,
    };

    try {
      if (transaction) {
        updateTransaction({ ...transactionData, id: transaction.id });
        toast({
          title: 'Transaction updated',
          description: 'Your transaction has been updated.',
        });
      } else {
        addTransaction(transactionData);
        toast({
          title: 'Transaction added',
          description: 'Your transaction has been created.',
        });
        form.reset({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          description: '',
          category: '',
          type: 'expense',
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income" className="text-income-foreground">Income</SelectItem>
                    <SelectItem value="expense" className="text-expense-foreground">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
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
                    {categories.map((category) => (
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
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter description" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </form>
    </Form>
  );
}

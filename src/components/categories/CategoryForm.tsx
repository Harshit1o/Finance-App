
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Category } from '@/types/finance';
import { useFinance } from '@/context/FinanceContext';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  color: z.string().min(4, 'Color is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { addCategory, updateCategory } = useFinance();
  
  const defaultValues: Partial<CategoryFormValues> = category
    ? {
        name: category.name,
        color: category.color,
      }
    : {
        color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
      };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  function onSubmit(data: CategoryFormValues) {
    try {
      if (category) {
        updateCategory({ 
          id: category.id,
          name: data.name, 
          color: data.color 
        });
        toast({
          title: 'Category updated',
          description: 'Your category has been updated.',
        });
      } else {
        addCategory({
          name: data.name,
          color: data.color
        });
        toast({
          title: 'Category added',
          description: 'Your category has been created.',
        });
        form.reset({
          name: '',
          color: '#' + Math.floor(Math.random()*16777215).toString(16),
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input type="color" {...field} className="w-12 h-10 p-1" />
                </FormControl>
                <Input 
                  value={field.value} 
                  onChange={field.onChange} 
                  className="flex-1" 
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          {category ? 'Update Category' : 'Add Category'}
        </Button>
      </form>
    </Form>
  );
}

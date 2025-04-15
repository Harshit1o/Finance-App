import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, FinanceSummary } from '@/types/finance';
import { transactionsApi, categoriesApi, budgetsApi } from '@/utils/api';
import { toast } from '@/components/ui/use-toast';

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  summary: FinanceSummary;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (budget: Budget) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categorySummary: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from API
        const [transactionsData, categoriesData, budgetsData] = await Promise.all([
          transactionsApi.getAll(),
          categoriesApi.getAll(),
          budgetsApi.getAll()
        ]);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the database. Please ensure the server is running.',
          variant: 'destructive',
        });

        // Initialize with empty arrays
        setTransactions([]);
        setCategories([]);
        setBudgets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate summary whenever transactions or categories change
  useEffect(() => {
    calculateSummary();
  }, [transactions, categories]);

  const calculateSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    // Calculate category-wise summary
    const categorySummary = categories.map(category => {
      const amount = transactions
        .filter(t => t.category === category.id)
        .reduce((acc, curr) => {
          return curr.type === 'expense' ? acc + curr.amount : acc;
        }, 0);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        amount,
        color: category.color,
      };
    }).filter(cat => cat.amount > 0);
    
    setSummary({
      totalIncome,
      totalExpense,
      balance,
      categorySummary,
    });
  };

  // Transaction operations
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionsApi.add(transaction);
      setTransactions(prev => [...prev, newTransaction]);
      toast({
        title: 'Success',
        description: 'Transaction added successfully',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      await transactionsApi.update(transaction);
      setTransactions(prev => prev.map(t => 
        t.id === transaction.id ? transaction : t
      ));
      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        variant: 'destructive',
      });
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionsApi.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        variant: 'destructive',
      });
    }
  };

  // Category operations
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const newCategory = await categoriesApi.add(category);
      setCategories(prev => [...prev, newCategory]);
      toast({
        title: 'Success',
        description: 'Category added successfully',
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      });
    }
  };

  const updateCategory = async (category: Category) => {
    try {
      await categoriesApi.update(category);
      setCategories(prev => prev.map(c => 
        c.id === category.id ? category : c
      ));
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const deleteCategory = async (id: string) => {
    // Check if category is in use by any transaction
    const inUse = transactions.some(t => t.category === id);
    if (inUse) {
      toast({
        title: 'Error',
        description: 'Cannot delete category that is in use by transactions',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      // Delete associated budgets
      const budgetsToDelete = budgets.filter(b => b.categoryId === id);
      for (const budget of budgetsToDelete) {
        await budgetsApi.delete(budget.id);
      }
      setBudgets(prev => prev.filter(b => b.categoryId !== id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  // Budget operations
  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    // Check if budget already exists for this category and month
    const exists = budgets.some(
      b => b.categoryId === budget.categoryId && b.month === budget.month
    );
    
    if (exists) {
      toast({
        title: 'Error',
        description: 'Budget already exists for this category and month',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const newBudget = await budgetsApi.add(budget);
      setBudgets(prev => [...prev, newBudget]);
      toast({
        title: 'Success',
        description: 'Budget added successfully',
      });
    } catch (error) {
      console.error('Error adding budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to add budget',
        variant: 'destructive',
      });
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      await budgetsApi.update(budget);
      setBudgets(prev => prev.map(b => 
        b.id === budget.id ? budget : b
      ));
      toast({
        title: 'Success',
        description: 'Budget updated successfully',
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to update budget',
        variant: 'destructive',
      });
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await budgetsApi.delete(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      toast({
        title: 'Success',
        description: 'Budget deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete budget',
        variant: 'destructive',
      });
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        summary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        isLoading,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};


import { Transaction, Category, Budget } from '@/types/finance';

// Base API URL - this would point to your backend server in production
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5000/api';

// Local storage keys for mock data
const LS_TRANSACTIONS = 'finance_transactions';
const LS_CATEGORIES = 'finance_categories';
const LS_BUDGETS = 'finance_budgets';

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize localStorage if needed (only in browser)
const initLocalStorage = () => {
  if (typeof window !== 'undefined') {
    if (!localStorage.getItem(LS_TRANSACTIONS)) {
      localStorage.setItem(LS_TRANSACTIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(LS_CATEGORIES)) {
      localStorage.setItem(LS_CATEGORIES, JSON.stringify([]));
    }
    if (!localStorage.getItem(LS_BUDGETS)) {
      localStorage.setItem(LS_BUDGETS, JSON.stringify([]));
    }
  }
};

// Initialize on load
initLocalStorage();

// Mock data helpers
const getMockTransactions = (): Transaction[] => {
  return JSON.parse(localStorage.getItem(LS_TRANSACTIONS) || '[]');
};

const getMockCategories = (): Category[] => {
  return JSON.parse(localStorage.getItem(LS_CATEGORIES) || '[]');
};

const getMockBudgets = (): Budget[] => {
  return JSON.parse(localStorage.getItem(LS_BUDGETS) || '[]');
};

const saveMockTransactions = (data: Transaction[]) => {
  localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(data));
};

const saveMockCategories = (data: Category[]) => {
  localStorage.setItem(LS_CATEGORIES, JSON.stringify(data));
};

const saveMockBudgets = (data: Budget[]) => {
  localStorage.setItem(LS_BUDGETS, JSON.stringify(data));
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    try {
      const response = await fetch(`${API_URL}/transactions`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions, using local storage:', error);
      return getMockTransactions();
    }
  },
  
  add: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error('Failed to add transaction');
      return await response.json();
    } catch (error) {
      console.error('Error adding transaction, using local storage:', error);
      const newTransaction = { ...transaction, id: generateId() };
      const currentData = getMockTransactions();
      saveMockTransactions([...currentData, newTransaction]);
      return newTransaction;
    }
  },
  
  update: async (transaction: Transaction): Promise<Transaction> => {
    try {
      const response = await fetch(`${API_URL}/transactions/${transaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      return await response.json();
    } catch (error) {
      console.error('Error updating transaction, using local storage:', error);
      const currentData = getMockTransactions();
      const updatedData = currentData.map(item => 
        item.id === transaction.id ? transaction : item
      );
      saveMockTransactions(updatedData);
      return transaction;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
    } catch (error) {
      console.error('Error deleting transaction, using local storage:', error);
      const currentData = getMockTransactions();
      saveMockTransactions(currentData.filter(item => item.id !== id));
    }
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories, using local storage:', error);
      return getMockCategories();
    }
  },
  
  add: async (category: Omit<Category, 'id'>): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error('Failed to add category');
      return await response.json();
    } catch (error) {
      console.error('Error adding category, using local storage:', error);
      const newCategory = { ...category, id: generateId() };
      const currentData = getMockCategories();
      saveMockCategories([...currentData, newCategory]);
      return newCategory;
    }
  },
  
  update: async (category: Category): Promise<Category> => {
    try {
      const response = await fetch(`${API_URL}/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error('Failed to update category');
      return await response.json();
    } catch (error) {
      console.error('Error updating category, using local storage:', error);
      const currentData = getMockCategories();
      const updatedData = currentData.map(item => 
        item.id === category.id ? category : item
      );
      saveMockCategories(updatedData);
      return category;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete category');
    } catch (error) {
      console.error('Error deleting category, using local storage:', error);
      const currentData = getMockCategories();
      saveMockCategories(currentData.filter(item => item.id !== id));
    }
  },
};

// Budgets API
export const budgetsApi = {
  getAll: async (): Promise<Budget[]> => {
    try {
      const response = await fetch(`${API_URL}/budgets`);
      if (!response.ok) throw new Error('Failed to fetch budgets');
      return await response.json();
    } catch (error) {
      console.error('Error fetching budgets, using local storage:', error);
      return getMockBudgets();
    }
  },
  
  add: async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
    try {
      const response = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error('Failed to add budget');
      return await response.json();
    } catch (error) {
      console.error('Error adding budget, using local storage:', error);
      const newBudget = { ...budget, id: generateId() };
      const currentData = getMockBudgets();
      saveMockBudgets([...currentData, newBudget]);
      return newBudget;
    }
  },
  
  update: async (budget: Budget): Promise<Budget> => {
    try {
      const response = await fetch(`${API_URL}/budgets/${budget.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      if (!response.ok) throw new Error('Failed to update budget');
      return await response.json();
    } catch (error) {
      console.error('Error updating budget, using local storage:', error);
      const currentData = getMockBudgets();
      const updatedData = currentData.map(item => 
        item.id === budget.id ? budget : item
      );
      saveMockBudgets(updatedData);
      return budget;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/budgets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete budget');
    } catch (error) {
      console.error('Error deleting budget, using local storage:', error);
      const currentData = getMockBudgets();
      saveMockBudgets(currentData.filter(item => item.id !== id));
    }
  },
};
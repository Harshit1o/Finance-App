
// Transaction type definition
export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
};

// Category type definition
export type Category = {
  id: string;
  name: string;
  color: string;
  icon?: string;
};

// Budget type definition
export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // Format: YYYY-MM
};

// Summary stats type
export type FinanceSummary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categorySummary: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
  }[];
};

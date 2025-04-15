
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TransactionList } from '@/components/transactions/TransactionList';

export default function Transactions() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <TransactionList />
      </div>
    </MainLayout>
  );
}

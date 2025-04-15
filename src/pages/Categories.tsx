
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryManager } from '@/components/categories/CategoryManager';

export default function Categories() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <CategoryManager />
      </div>
    </MainLayout>
  );
}

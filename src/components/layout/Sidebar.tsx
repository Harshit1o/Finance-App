
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Receipt, PieChart, Wallet, Settings } from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: Receipt,
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: PieChart,
  },
  {
    title: 'Budget',
    href: '/budget',
    icon: Wallet,
  },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="h-screen w-64 border-r bg-card flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">FinanceTracker</h1>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Personal Finance</span>
          <button
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

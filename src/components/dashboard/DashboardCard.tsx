
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  iconClassName?: string;
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  className,
  iconClassName,
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && (
          <div className={cn("p-2 rounded-full", iconClassName)}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="mt-1 text-xs">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

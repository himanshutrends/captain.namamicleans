"use client";

import { Check, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { materialsChecklist, MaterialItem, iconMap } from '@/config/serviceConfig';
import { cn } from '@/lib/utils';

interface MaterialCheckState {
  checked: boolean;
  quantity?: number;
}

interface MaterialsChecklistProps {
  checkedItems: Record<string, MaterialCheckState>;
  onToggle: (itemId: string) => void;
  onQuantityChange: (itemId: string, quantity: number) => void;
}

export function MaterialsChecklist({ checkedItems, onToggle, onQuantityChange }: MaterialsChecklistProps) {
  const requiredItems = materialsChecklist.filter(item => item.required);
  const allRequiredChecked = requiredItems.every(item => {
    const state = checkedItems[item.id];
    if (!state?.checked) return false;
    if (item.hasQuantity && (!state.quantity || state.quantity < (item.minQuantity || 0))) return false;
    return true;
  });
  const checkedCount = Object.values(checkedItems).filter(s => s.checked).length;
  const totalCount = materialsChecklist.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-foreground">Materials Checklist</h4>
          <p className="text-sm text-muted-foreground">
            {checkedCount}/{totalCount} items checked
          </p>
        </div>
        {allRequiredChecked ? (
          <div className="flex items-center gap-1 text-primary">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Required items pending</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {materialsChecklist.map((item) => {
          const state = checkedItems[item.id] || { checked: false };
          const IconComponent = iconMap[item.iconName];
          
          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col gap-2 p-3 rounded-lg border transition-all",
                state.checked 
                  ? "bg-primary/5 border-primary/30" 
                  : "bg-card border-border hover:border-primary/30"
              )}
            >
              <button
                onClick={() => onToggle(item.id)}
                className="w-full flex items-center gap-3"
              >
                <Checkbox 
                  checked={state.checked}
                  className="pointer-events-none"
                />
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1 text-left">
                  <span className={cn(
                    "font-medium",
                    state.checked ? "text-primary" : "text-foreground"
                  )}>
                    {item.name}
                  </span>
                  {item.required && (
                    <span className="ml-2 text-xs text-destructive">*Required</span>
                  )}
                  {item.hasQuantity && (
                    <p className="text-xs text-muted-foreground">
                      Enter quantity ({item.unit})
                    </p>
                  )}
                </div>
                {state.checked && !item.hasQuantity && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>

              {/* Quantity input for items that need it */}
              {item.hasQuantity && state.checked && (
                <div className="flex items-center gap-2 ml-14">
                  <Input
                    type="number"
                    placeholder={`Enter ${item.unit}`}
                    value={state.quantity || ''}
                    onChange={(e) => onQuantityChange(item.id, parseFloat(e.target.value) || 0)}
                    className="h-9 w-24"
                    min={item.minQuantity}
                    max={item.maxQuantity}
                    step={item.unit === 'L' ? 0.5 : 1}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-muted-foreground">{item.unit}</span>
                  {state.quantity && state.quantity >= (item.minQuantity || 0) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { ActionItem as ActionItemType } from "@/types/meeting";

type ActionItemProps = {
  item: ActionItemType;
  disabled?: boolean;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
};

export function ActionItem({ item, disabled = false, onToggle, onDelete }: ActionItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border p-3">
      <Checkbox
        checked={item.completed}
        disabled={disabled}
        onChange={(event) => onToggle(event.currentTarget.checked)}
        aria-label={`Mark ${item.task} complete`}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm leading-5", item.completed && "text-muted-foreground line-through")}>
          {item.task}
        </p>
        {item.assigned_to ? <p className="mt-1 text-xs text-muted-foreground">{item.assigned_to}</p> : null}
      </div>
      <Button size="icon" variant="ghost" onClick={onDelete} disabled={disabled} aria-label="Delete action item">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}


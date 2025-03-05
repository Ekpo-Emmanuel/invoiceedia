"use client";

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AdvancedFilters, { FilterValues } from '../advanced-filters';


interface StatusFilterProps {
  clients: Array<{ id: string; name: string }>;
  onFilterChange: (filters: FilterValues) => void;
}

export default function StatusFilter({ clients, onFilterChange }: StatusFilterProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className=""
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">filter</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] -translate-x-10 dark:bg-[#1b1b1d] border dark:border-primary/10 rounded-lg">
        <AdvancedFilters 
          clients={clients}
          onFilterChange={onFilterChange}
        />
      </PopoverContent>
    </Popover>
  );
}

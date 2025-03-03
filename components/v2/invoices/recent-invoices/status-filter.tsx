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

interface StatusFilterProps {
  ontoggleAdvancedFilters: () => void;
}

export default function StatusFilter({ ontoggleAdvancedFilters }: StatusFilterProps) {
  return (
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className=""
                onClick={ontoggleAdvancedFilters}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">filter</TooltipContent>
        </Tooltip>
      </TooltipProvider>
  );
}

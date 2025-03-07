import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import DateRangePicker from "./advanced-filter/date-range-picker"

export interface FilterValues {
  clientId?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface AdvancedFiltersProps {
  clients: Array<{ id: string; name: string }>;
  onFilterChange: (filters: FilterValues) => void;
}

export default function AdvancedFilters({ clients, onFilterChange }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({});
  const [minAmount, setMinAmount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    setFilters(prev => {
      if (value === "" || value === undefined) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { ...prev, [key]: value };
    });
  };

  const handleApplyFilters = () => {
    const filtersToApply = { ...filters };
    
    if (minAmount) {
      filtersToApply.minAmount = parseFloat(minAmount);
    }
    
    if (maxAmount) {
      filtersToApply.maxAmount = parseFloat(maxAmount);
    }
    
    onFilterChange(filtersToApply);
  };

  const handleResetFilters = () => {
    setFilters({});
    setMinAmount("");
    setMaxAmount("");
    onFilterChange({});
  };

  return (
    <div className="">
      <div>
        <div className="text-md font-semibold">Advanced Filters</div>
      </div>
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select 
            value={filters.clientId} 
            onValueChange={(value) => handleFilterChange("clientId", value)}
          >
            <SelectTrigger id="client">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount Range</Label>
          <div className="flex space-x-2">
            <Input 
              id="amount-min" 
              placeholder="Min" 
              type="number" 
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="bg-transparent"
            />
            <Input 
              id="amount-max" 
              placeholder="Max" 
              type="number" 
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="bg-transparent"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date Range</Label>
          {/* <DateRangePicker 
            value={filters.dateRange}
            onChange={(range) => handleFilterChange("dateRange", range)}
          /> */}
        </div>
        <div className="flex space-x-2">
          <Button className="flex-1" size="sm" onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button 
            className="flex-1" 
            size="sm" 
            variant="outline" 
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}


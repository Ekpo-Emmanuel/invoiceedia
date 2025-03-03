import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import DateRangePicker from "./advanced-filter/date-range-picker"

export default function AdvancedFilters() {
  return (
    <Card className="dark:bg-muted/30 border dark:border-primary/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select>
            <SelectTrigger id="client">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acme">Acme Corp</SelectItem>
              <SelectItem value="globex">Globex</SelectItem>
              <SelectItem value="initech">Initech</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount Range</Label>
          <div className="flex space-x-2">
            <Input id="amount-min" placeholder="Min" type="number" />
            <Input id="amount-max" placeholder="Max" type="number" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date Range</Label>
          {/* <DateRangePicker /> */}
        </div>
        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}


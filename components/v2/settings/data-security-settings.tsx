"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, LogOut, Lock, FileText, Calendar, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DataSecuritySettingsProps {
  organization: any;
  organizationSlug: string;
}

export default function DataSecuritySettings({ organization, organizationSlug }: DataSecuritySettingsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [exportFormat, setExportFormat] = useState("pdf")
  const [exportPeriod, setExportPeriod] = useState("all")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleExportInvoices = async () => {
    setIsExporting(true)
    try {
      // TODO: Implement the API call to export invoices
      console.log(`Exporting invoices in ${exportFormat} format for period ${exportPeriod}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Invoices exported successfully in ${exportFormat.toUpperCase()} format`)
    } catch (error) {
      toast.error("Failed to export invoices")
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleChangePassword = async () => {
    // Reset error
    setPasswordError("")
    
    // Validate passwords
    if (!currentPassword) {
      setPasswordError("Current password is required")
      return
    }
    
    if (!newPassword) {
      setPasswordError("New password is required")
      return
    }
    
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    
    setIsChangingPassword(true)
    try {
      // TODO: Implement the API call to change password
      console.log("Changing password")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      toast.success("Password changed successfully")
    } catch (error) {
      toast.error("Failed to change password")
      console.error(error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogoutOtherDevices = async () => {
    setIsLoggingOut(true)
    try {
      // TODO: Implement the API call to logout from other devices
      console.log("Logging out from other devices")
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Logged out from all other devices")
    } catch (error) {
      toast.error("Failed to logout from other devices")
      console.error(error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Invoices
          </CardTitle>
          <CardDescription>
            Export your invoices for record-keeping or accounting purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="export-period">Time Period</Label>
              <Select value={exportPeriod} onValueChange={setExportPeriod}>
                <SelectTrigger id="export-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleExportInvoices} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          
          {passwordError && (
            <div className="text-sm text-red-500">{passwordError}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleChangePassword} 
            disabled={isChangingPassword}
            className="flex items-center gap-2"
          >
            {isChangingPassword ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Session Management
          </CardTitle>
          <CardDescription>
            Manage your active sessions and devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you suspect unauthorized access to your account, you can log out from all devices except your current one.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout from Other Devices
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logout from Other Devices</DialogTitle>
                <DialogDescription>
                  This will log you out from all devices except the current one. Are you sure you want to continue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="destructive" 
                  onClick={handleLogoutOtherDevices}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout from All Other Devices
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
} 
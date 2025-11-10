"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Trash2, AlertTriangle } from "lucide-react"
import { notifications } from "@/lib/notifications"
import type { BudgetNotification } from "@/lib/types"

export function NotificationCenter() {
  const [notificationList, setNotificationList] = useState<BudgetNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [open])

  const loadNotifications = () => {
    const allNotifications = notifications.getAll()
    setNotificationList(
      allNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    )
    setUnreadCount(notifications.getUnreadCount())
  }

  const handleMarkAsRead = (id: string) => {
    notifications.markAsRead(id)
    loadNotifications()
  }

  const handleMarkAllAsRead = () => {
    notifications.markAllAsRead()
    loadNotifications()
  }

  const handleDelete = (id: string) => {
    notifications.delete(id)
    loadNotifications()
  }

  const handleClearAll = () => {
    notifications.clearAll()
    loadNotifications()
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationMessage = (notification: BudgetNotification) => {
    if (notification.threshold >= 100) {
      return `You've exceeded your ${notification.budgetCategory} budget! Spent ₹${notification.spent.toFixed(0)} of ₹${notification.budgetAmount.toFixed(0)}.`
    }
    return `You've reached ${notification.threshold}% of your ${notification.budgetCategory} budget. Spent ₹${notification.spent.toFixed(0)} of ₹${notification.budgetAmount.toFixed(0)}.`
  }

  const getSeverityColor = (threshold: number) => {
    if (threshold >= 100) return "text-destructive"
    if (threshold >= 90) return "text-amber-600"
    return "text-accent"
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Budget Notifications</SheetTitle>
          <SheetDescription>Stay on top of your spending limits</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {notificationList.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="flex-1 bg-transparent">
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll} className="flex-1 bg-transparent">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-200px)]">
            {notificationList.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">No notifications yet</p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    You'll be notified when you approach your budget limits
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {notificationList.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`${!notification.read ? "border-accent bg-accent/5" : "bg-card"}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${getSeverityColor(notification.threshold)}`} />
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium leading-tight">
                              {notification.budgetCategory}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {formatTimestamp(notification.timestamp)}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-foreground">{getNotificationMessage(notification)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

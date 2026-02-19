import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, type Notification as AppNotification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    requestPushPermission,
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const [hasAskedPermission, setHasAskedPermission] = useState(false);

  const handleOpen = async () => {
    setOpen(!open);
    if (!hasAskedPermission && "Notification" in window && Notification.permission === "default") {
      setHasAskedPermission(true);
      await requestPushPermission();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={handleOpen}
        className="relative rounded-full border shadow-theme-sm hover:shadow-theme-md hover-lift press-effect transition-all duration-200"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-scale-in">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Panel */}
          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border bg-card shadow-theme-xl animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAllAsRead()}
                    className="h-7 text-xs rounded-full hover:bg-primary/10 hover:text-primary press-effect"
                  >
                    <CheckCheck className="mr-1 h-3 w-3" /> Read all
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  className="h-7 w-7 rounded-full hover:bg-muted press-effect"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Reminders will appear here when tasks are due
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function NotificationItem({
  notification: n,
  onMarkRead,
  onDelete,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`group flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors duration-150 ${
        n.is_read ? "opacity-60" : "bg-primary/[0.03]"
      } hover:bg-muted/40`}
    >
      <div className="mt-0.5">
        {!n.is_read && (
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
        )}
        {n.is_read && <span className="flex h-2 w-2" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{n.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {!n.is_read && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMarkRead(n.id)}
            className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(n.id)}
          className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default NotificationBell;

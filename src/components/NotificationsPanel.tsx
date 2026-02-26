import { Bell, CloudRain, TrendingUp, Droplets, FlaskConical, X } from 'lucide-react';
import { Notification } from '@/types/agrigenie';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
}

export function NotificationsPanel({ notifications, onClose }: NotificationsPanelProps) {
  const { t } = useTranslation();
  const [items, setItems] = useState(notifications);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'weather': return <CloudRain className="w-5 h-5 text-water" />;
      case 'market': return <TrendingUp className="w-5 h-5 text-primary" />;
      case 'irrigation': return <Droplets className="w-5 h-5 text-sky" />;
      case 'fertilizer': return <FlaskConical className="w-5 h-5 text-accent" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(date);
  };

  const markAsRead = (id: string) => {
    setItems(items.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l border-border shadow-elevated z-50 animate-slide-in-right">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">{t('dashboard.notifications')}</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">{unreadCount}</span>
          )}
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-65px)]">
        {items.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{t('dashboard.noNotifications')}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((notification) => (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`w-full p-4 text-left hover:bg-muted transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </span>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{formatTime(notification.timestamp)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

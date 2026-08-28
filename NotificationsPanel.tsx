import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Bell,
  CheckCircle2,
  Package,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  DollarSign,
} from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    t,
  } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'inventory_alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'payout':
        return <DollarSign className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleNotificationClick = (notif: any) => {
    markNotificationAsRead(notif.id);
    if (notif.linkTo) {
      setActiveTab(notif.linkTo);
      onClose();
    }
  };

  return (
    <div
      id="notifications-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-end sm:p-4 animate-in fade-in duration-150"
    >
      <div className="w-full max-w-sm h-full sm:h-auto sm:max-h-[85vh] bg-[#FDFCFB] dark:bg-[#22211E] sm:rounded-2xl border border-[#E5E2DD] dark:border-[#383632] shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="p-3.5 border-b border-[#E5E2DD] dark:border-[#383632] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#5A5A40] dark:text-[#C8C7B8]" />
            <h3 className="font-serif italic font-bold text-sm text-[#1A1A1A] dark:text-[#F5F3EF]">
              {t.notifications}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[10px] font-semibold text-[#5A5A40] dark:text-[#C8C7B8] hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#A5A29D] hover:text-[#1A1A1A] dark:hover:text-[#F5F3EF]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#A5A29D]">
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs ${
                  notif.isRead
                    ? 'bg-white dark:bg-[#2C2A26] border-[#E5E2DD] dark:border-[#383632] text-[#A5A29D]'
                    : 'bg-[#F5F2ED] dark:bg-[#2C2A26] border-[#5A5A40]/30 text-[#1A1A1A] dark:text-[#F5F3EF] font-medium'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="p-1.5 rounded-lg bg-[#FDFCFB] dark:bg-[#22211E] border border-[#E5E2DD] dark:border-[#383632] shrink-0">
                    {getIcon(notif.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-xs truncate text-[#1A1A1A] dark:text-[#F5F3EF]">{notif.title}</h4>
                      <span className="text-[9px] text-[#A5A29D] shrink-0 ml-1">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5A5A40] dark:text-[#C8C7B8] mt-0.5 leading-relaxed">
                      {notif.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

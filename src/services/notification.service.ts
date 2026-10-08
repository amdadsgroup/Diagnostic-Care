import { supabase } from '@/lib/supabase/client';

export interface AppNotification {
  id: string;
  title: string;
  titleBn?: string;
  message: string;
  messageBn?: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

export class NotificationService {
  /**
   * Fetch active notifications for logged in user directly from PostgreSQL.
   * Never creates fake notification entries.
   */
  static async getUserNotifications(recipientId: string): Promise<AppNotification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', recipientId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error || !data) {
        return [];
      }

      return data.map((n: any) => ({
        id: n.id,
        title: n.title,
        titleBn: n.title_bn,
        message: n.message,
        messageBn: n.message_bn,
        notificationType: n.notification_type,
        isRead: n.is_read,
        createdAt: n.created_at,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
    } catch (err) {
      console.warn('Error marking notification as read:', err);
    }
  }

  /**
   * Realtime subscription to incoming notifications
   */
  static subscribeToNotifications(recipientId: string, onNotification: (notif: AppNotification) => void) {
    const channel = supabase
      .channel(`notifications:${recipientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${recipientId}`,
        },
        (payload: any) => {
          if (payload.new) {
            onNotification({
              id: payload.new.id,
              title: payload.new.title,
              titleBn: payload.new.title_bn,
              message: payload.new.message,
              messageBn: payload.new.message_bn,
              notificationType: payload.new.notification_type,
              isRead: payload.new.is_read,
              createdAt: payload.new.created_at,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

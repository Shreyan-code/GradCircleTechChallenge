'use client';
import { useToast } from './use-toast';
import { useNotifications } from '@/context/notification-context';
import type { Toast } from './use-toast';

export function useNotificationToast() {
    const { toast } = useToast();
    const { addNotification } = useNotifications();

    const notificationToast = (props: Toast) => {
        const { title, description } = props;
        
        let notifTitle: string | undefined;
        let notifDescription: string | undefined;

        if (typeof title === 'string') {
            notifTitle = title;
        }
        if (typeof description === 'string') {
            notifDescription = description;
        }

        if (notifTitle) {
            addNotification({ title: notifTitle, description: notifDescription });
        } else if (notifDescription) {
            addNotification({ title: notifDescription });
        }
        
        toast(props);
    };

    return { notificationToast };
}

import { isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

export default function groupChatsByDate(chats: any[]) {
    const groups: Record<string, any[]> = {
        "Today": [],
        "Yesterday": [],
        "This Week": [],
        "This Month": [],
        "Older": [],
    };

    chats.forEach((chat) => {
        const date = typeof chat.createdAt === 'string' ? parseISO(chat.createdAt) : chat.createdAt;

        if (isToday(date)) groups["Today"].push(chat);
        else if (isYesterday(date)) groups["Yesterday"].push(chat);
        else if (isThisWeek(date, { weekStartsOn: 1 })) groups["This Week"].push(chat);
        else if (isThisMonth(date)) groups["This Month"].push(chat);
        else groups["Older"].push(chat);
    });

    return groups;
}
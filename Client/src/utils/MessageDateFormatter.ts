export default function MessageDateFormatter(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();

    const isToday =
        date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
        date.toDateString() === yesterday.toDateString();

    const msInDay = 86400000;
    const daysAgo = Math.floor((now.getTime() - date.getTime()) / msInDay);
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    const time = date.toLocaleTimeString(undefined, options);

    if (isToday) {
        return time;
    }

    if (isYesterday) {
        return `Yesterday · ${time}`;
    }

    if (daysAgo <= 7) {
        const weekday = date.toLocaleDateString(undefined, {
            weekday: 'long',
        });
        return `${weekday} · ${time}`;
    }

    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }) + ` · ${time}`;
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }) + ` · ${time}`;
}

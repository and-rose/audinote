export class AudioComment {
    label: string;
    dateTime: Date;
    comment?: string;
    timePosition: number;
    id: string;

    constructor(
        label: string,
        dateTime: Date,
        timePosition: number,
        id: string,
        comment?: string
    ) {
        this.label = label;
        this.id = id;
        this.dateTime = dateTime;
        this.timePosition = timePosition;
        this.comment = comment;
    }
}

export class TaskComment extends AudioComment {
    complete: boolean;

    constructor(
        label: string,
        dateTime: Date,
        timePosition: number,
        complete: boolean,
        id: string,
        comment?: string
    ) {
        super(label, dateTime, timePosition, id, comment);
        this.complete = complete;
    }
}

export function toTimeStamp(seconds: number): string {
    return new Date(seconds * 1000)
        .toISOString()
        .substring(14, 23)
        .replace(".", ":");
}

export function toShortTimeStamp(seconds: number): string {
    return new Date(seconds * 1000)
        .toISOString()
        .substring(14, 19)
        .replace(".", ":");
}

export function timeDifference(current, previous) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute / 2) {
        return "Just now";
    } else if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
        return Math.round(elapsed / msPerYear) + " years ago";
    }
}

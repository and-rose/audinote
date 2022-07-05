export class AudioComment {
    label: String;
    dateTime: Date;
    comment?: String;
    timePosition: number;

    constructor(
        label: String,
        dateTime: Date,
        timePosition: number,
        comment?: String
    ) {
        this.label = label;
        this.dateTime = dateTime;
        this.timePosition = timePosition;
        this.comment = comment;
    }
}

export class TaskComment extends AudioComment {
    complete: boolean;

    constructor(
        label: String,
        dateTime: Date,
        timePosition: number,
        complete: boolean,
        comment?: String
    ) {
        super(label, dateTime, timePosition, comment);
        this.complete = complete;
    }
}

export function toTimeStamp(seconds: number): String {
    return new Date(seconds * 1000)
        .toISOString()
        .substring(14, 23)
        .replace(".", ":");
}

export function toShortTimeStamp(seconds: number): String {
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
        return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
        return (
            "approximately " + Math.round(elapsed / msPerMonth) + " months ago"
        );
    } else {
        return (
            "approximately " + Math.round(elapsed / msPerYear) + " years ago"
        );
    }
}

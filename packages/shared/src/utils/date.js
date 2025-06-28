"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isYesterday = exports.isToday = exports.formatRelativeTime = exports.formatDateTime = exports.formatDate = void 0;
const formatDate = (date) => {
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
exports.formatDate = formatDate;
const formatDateTime = (date) => {
    return date.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
exports.formatDateTime = formatDateTime;
const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return '今';
    }
    else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}分前`;
    }
    else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}時間前`;
    }
    else if (diffInSeconds < 2592000) {
        return `${Math.floor(diffInSeconds / 86400)}日前`;
    }
    else {
        return (0, exports.formatDate)(date);
    }
};
exports.formatRelativeTime = formatRelativeTime;
const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};
exports.isToday = isToday;
const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
};
exports.isYesterday = isYesterday;
//# sourceMappingURL=date.js.map
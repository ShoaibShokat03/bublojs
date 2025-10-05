const time = {
  now: () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const time = hours + ":" + minutes + ":" + seconds;
    return time;
  },
    today: () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const today = `${day}/${month}/${year}`;
        return today;
    },
    date: () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const today = `${day}/${month}/${year}`;
        return today;
    },
    year: () => {
        const date = new Date();
        const year = date.getFullYear();
        return year;
    },
    month: () => {
        const date = new Date();
        const month = date.getMonth() + 1;
        return month;
    },
    day: () => {
        const date = new Date();
        const day = date.getDate();
        return day;
    },
    hours: () => {
        const date = new Date();
        const hours = date.getHours();
        return hours;
    },
    minutes: () => {
        const date = new Date();
        const minutes = date.getMinutes();
        return minutes;
    },
    seconds: () => {
        const date = new Date();
        const seconds = date.getSeconds();
        return seconds;
    },
    milliseconds: () => {
        const date = new Date();
        const milliseconds = date.getMilliseconds();
        return milliseconds;
    },
    time: () => {
        const date = new Date();
        const time = date.getTime();
        return time;
    },
    timezone: () => {
        const date = new Date();
        const timezone = date.getTimezoneOffset();
        return timezone;
    },
    dayName: () => {
        const date = new Date();
        const day = date.getDay();
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day];
    },
    monthName: () => {
        const date = new Date();
        const month = date.getMonth();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month];
    },
    dayOfYear: () => {
        const date = new Date();
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        return day;
    },
    weekOfYear: () => {
        const date = new Date();
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
        const result = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
        return result;
    },
    daysLeftInYear: () => {
        const date = new Date();
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const day = Math.floor(diff / oneDay);
        const daysInYear = 365;
        const result = daysInYear - day;
        return result;
    },
    daysLeftInMonth: () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const daysInMonth = new Date(year, month, 0).getDate();
        const result = daysInMonth - day;
        return result;
    },
    daysLeftInWeek: () => {
        const date = new Date();
        const day = date.getDay();
        const result = 7 - day;
        return result;
    },
    isLeapYear: () => {
        const date = new Date();
        const year = date.getFullYear();
        if (year % 4 === 0) {
            return true;
        } else {
            return false;
        }
    },
    isToday: () => {
        const date = new Date();
        const today = date.toDateString();
        const inputDate = new Date();
        if (inputDate.toDateString() === today) {
            return true;
        } else {
            return false;
        }
    },
    isWeekend: () => {
        const date = new Date();
        const day = date.getDay();
        if (day === 0 || day === 6) {
            return true;
        } else {
            return false;
        }
    },
    isFuture: (inputDate) => {
        const date = new Date();
        const today = date.getTime();
        if (inputDate > today) {
            return true;
        } else {
            return false;
        }
    },
    isPast: (inputDate) => {
        const date = new Date();
        const today = date.getTime();
        if (inputDate < today) {
            return true;
        } else {
            return false;
        }
    },
};
export default time;

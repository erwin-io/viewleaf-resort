"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateWithTimeZone = exports.getNextMonth = exports.getNextWeek = exports.getNextDate = exports.CONST_QUERYCURRENT_TIMESTAMP = void 0;
exports.CONST_QUERYCURRENT_TIMESTAMP = "select (now() AT TIME ZONE 'Asia/Manila'::text) as timestamp";
const getNextDate = (currentDate, numberOfDays) => {
    return `select (('${currentDate}'AT TIME ZONE 'Asia/Manila'::text)::date + ${numberOfDays.toString()}) as nextdate`;
};
exports.getNextDate = getNextDate;
const getNextWeek = (currentDate) => {
    return `select (('${currentDate}'AT TIME ZONE 'Asia/Manila'::text)::date + interval '1 week')::date as nextweek`;
};
exports.getNextWeek = getNextWeek;
const getNextMonth = (currentDate) => {
    return `select (('${currentDate}'AT TIME ZONE 'Asia/Manila'::text)::date + interval '1 month')::date as nextmonth`;
};
exports.getNextMonth = getNextMonth;
const getDateWithTimeZone = (currentDate, timeZone) => {
    return `select (('${currentDate} ' || (now()::time AT TIME ZONE '${timeZone}'))::timestamp AT TIME ZONE '${timeZone}'::text) as "timeZone"`;
};
exports.getDateWithTimeZone = getDateWithTimeZone;
//# sourceMappingURL=timestamp.constant.js.map
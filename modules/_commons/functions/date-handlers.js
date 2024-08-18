import moment from "moment";

export const getHourPeriod = (end) => ({
    end,
    start: new Date(moment(end).subtract(1, "h"))
});

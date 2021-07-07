import dayjs from "dayjs";

export default {
    methods: {
        compareTime(time) {
            const currentTime = ~~dayjs().format("HHmm");
            const startDateCompare = dayjs().isAfter(dayjs(time.StartDate)) || dayjs().isSame(dayjs(time.StartDate), "day");
            const overDateCompare = dayjs().isBefore(dayjs(time.OverDate)) || dayjs().isSame(dayjs(time.OverDate), "day");
            return currentTime >= ~~time.StartTime.replace(":", "") && currentTime <= ~~time.OverTime.replace(":", "") && startDateCompare && overDateCompare;
        },
    }
}
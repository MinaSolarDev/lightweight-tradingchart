import { useEffect, useCallback, useState } from "react";
import { DateRangePicker } from "rsuite";
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';

function DatetimeView(props) {
    const { afterToday } = DateRangePicker;

    const predefinedRanges = [
        {
            label: "Today",
            value: [new Date(), new Date()],
            placement: "left",
        },
        {
            label: "Yesterday",
            value: [addDays(new Date(), -1), addDays(new Date(), -1)],
            placement: "left",
        },
        {
            label: "This week",
            value: [startOfWeek(new Date()), endOfWeek(new Date())],
            placement: "left",
        },
        {
            label: "Last 7 days",
            value: [subDays(new Date(), 6), new Date()],
            placement: "left",
        },
        {
            label: "Last 30 days",
            value: [subDays(new Date(), 29), new Date()],
            placement: "left",
        },
        {
            label: "This month",
            value: [startOfMonth(new Date()), new Date()],
            placement: "left",
        },
        {
            label: "Last month",
            value: [
                startOfMonth(addMonths(new Date(), -1)),
                endOfMonth(addMonths(new Date(), -1)),
            ],
            placement: "left",
        },
        {
            label: "This year",
            value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
            placement: "left",
        },
        {
            label: "Last year",
            value: [
                new Date(new Date().getFullYear() - 1, 0, 1),
                new Date(new Date().getFullYear(), 0, 0),
            ],
            placement: "left",
        },
        {
            label: "All time",
            value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
            placement: "left",
        },
        {
            label: "Last week",
            closeOverlay: false,
            value: (value) => {
                const [start = new Date()] = value || [];
                return [
                    addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
                    addDays(endOfWeek(start, { weekStartsOn: 0 }), -7),
                ];
            },
            appearance: "default",
        },
        {
            label: "Next week",
            closeOverlay: false,
            value: (value) => {
                const [start = new Date()] = value || [];
                return [
                    addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
                    addDays(endOfWeek(start, { weekStartsOn: 0 }), 7),
                ];
            },
            appearance: "default",
        },
    ];

    // const [fromDate, setFromDate] = useState(props.chartArray[props.active].startDate);
    // const [toDate, setToDate] = useState(props.chartArray[props.active].endDate);

    const setDateTimeRange = (ranges) => {
        // console.log("OK-Changed")
        // console.log("ranges", ranges)
        // console.log("1----From : ", ranges[0])
        // console.log("1----To   : ", ranges[1])
        // setFromDate(ranges[0].toISOString())
        // setToDate(ranges[1].toISOString())

        // console.log("2----From : ", fromDate)
        // console.log("2----To   : ", toDate)

        // console.log("3----From : ", ranges[0].toISOString())
        // console.log("3----To   : ", ranges[1].toISOString())

        let temp = props.chartArray;
        temp[props.active].startDate = ranges[0].toISOString();
        temp[props.active].endDate = ranges[1].toISOString();
        console.log("temp", temp);
        props.setChartArray({ ...temp });
    };

    return (
        <div className="datetime-view">
            <h4>Date Time Range : </h4>
            <DateRangePicker
                placement={'topStart'}
                format="yyyy-MM-dd HH:mm:ss"
                disabledDate={afterToday()}
                ranges={predefinedRanges}
                defaultCalendarValue={[new Date('2022-01-01 00:00:00'), new Date('2022-11-01 23:59:59')]}
                // defaultValue={[new Date("2021-12-09 21:00:00"), new Date("2022-05-06 21:00:00")]}
                defaultValue={[new Date(), new Date()]}
                // value={[new Date(fromDate), new Date(toDate)]}
                onChange={([from, end]) => setDateTimeRange([from, end])}
            />
        </div>
    );
}

export default DatetimeView;

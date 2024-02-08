import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { All_Leaves, month } from "./constants";
import { db, getMonthData, saveData } from "./db";

const disabledDates = () => All_Leaves.map((ph) => new Date(ph));

export default function CalendarApp({
    setPresentDates,
    resetMothData,
    presentDates,
    dateObj,
    setLeaves,
}) {
    const initialDays = [];
    const [days, setDays] = useState(initialDays);

    useEffect(() => {
        setPresentDates(days);
    }, [days, setPresentDates]);

    useEffect(() => {
        let data = getMonthData(dateObj.getMonth());
        if (data) {
            setDays(data.presentDates);
            setLeaves(data.leaves ?? "");
        } else {
            setDays(initialDays);
        }
    }, [dateObj]);

    return (
        <div className="card flex justify-content-center">
            <DayPicker
                mode="multiple"
                selected={days}
                onSelect={setDays}
                styles={{
                    head_cell: {
                        width: "80px",
                    },
                    table: {
                        maxWidth: "none",
                        width: "100%",
                    },
                    day: {
                        margin: "auto",
                    },
                }}
                captionLayout="dropdown-buttons"
                disabled={[...disabledDates(), { dayOfWeek: [0, 6] }]}
                onMonthChange={(month) => resetMothData(month)}
            />
        </div>
    );
}

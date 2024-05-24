import LocalStorageDB from "local-storage-db";

export const db = new LocalStorageDB("attendanceData");

export const saveData = (data) => {
    const isExist = db.get(data.month);
    if (isExist?.length > 0) {
        db.update(
            [
                {
                    leaves: data.leaves,
                    presentDates: data.presentDates,
                    percentReconcile: data.percentReconcile,
                    percentReconcileToggle: data.percentReconcileToggle,
                },
            ],
            data.month
        );
    } else {
        db.create(data.month, [
            {
                leaves: data.leaves,
                presentDates: data.presentDates,
                percentReconcile: data.percentReconcile,
                percentReconcileToggle: data.percentReconcileToggle,
            },
        ]);
    }
};

export const saveCountry = (country) => {
    db.update(country, "country");
};

export const getCountry = () => {
    let country = db.get("country");
    return country ?? "0";
};

export const getMonthData = (mnth) => {
    const localData = db.get(mnth);
    const monthData = localData ? localData[0] : localData;
    if (monthData) {
        const savedDates = monthData.presentDates.map(
            (dates) => new Date(dates)
        );
        return {
            leaves: monthData.leaves,
            presentDates: savedDates,
            percentReconcile: monthData.percentReconcile,
            percentReconcileToggle: monthData.percentReconcileToggle,
        };
    }
};

export const resetData = () => {
    db.remove();
};

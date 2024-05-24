// export const Jan_leaves = ["01/01/2024", "01/15/2024", "01/26/2024"];
// export const Apr_leaves = ["04/09/2024", "04/11/2024"];
// export const May_leaves = ["05/01/2024"];
// export const Aug_leaves = ["08/15/2024"];
// export const Oct_leaves = ["10/02/2024", "10/11/2024", "10/31/2024"];
// export const Nov_leaves = ["11/01/2024"];
// export const Dec_leaves = ["12/25/2024"];

export const publicHolidaysInd = {
    0: ["01/01/2024", "01/15/2024", "01/26/2024"],
    1: [],
    2: [],
    3: ["04/09/2024", "04/11/2024"],
    4: ["05/01/2024"],
    5: [],
    6: [],
    7: ["08/15/2024"],
    8: [],
    9: ["10/02/2024", "10/11/2024", "10/31/2024"],
    10: ["11/01/2024"],
    11: ["12/25/2024"],
};

export const publicHolidaysNSW = {
    0: ["01/01/2024", "01/26/2024"],
    1: [],
    2: ["03/29/2024"],
    3: ["04/01/2024", "04/25/2024"],
    4: [],
    5: ["06/10/2024"],
    6: [],
    7: ["08/05/2024"],
    8: [],
    9: ["10/07/2024"],
    10: [],
    11: ["12/25/2024", "12/26/2024"],
};

export const publicHolidaysVIC = {
    0: ["01/01/2024", "01/26/2024"],
    1: [],
    2: ["03/11/2024", "03/29/2024"],
    3: ["04/01/2024", "04/25/2024"],
    4: [],
    5: ["06/10/2024"],
    6: [],
    7: ["08/05/2024"],
    8: ["09/27/2024"],
    9: [],
    10: ["11/05/2024"],
    11: ["12/25/2024", "12/26/2024"],
};

export const returnPHCountry = (country) => {
    switch (country) {
        case "0":
            return publicHolidaysInd;
        case "1":
            return publicHolidaysVIC;
        case "2":
            return publicHolidaysNSW;
        default:
            return publicHolidaysInd;
    }
};

export const allLeaves = (country) => {
    let All_Leaves = [];
    let publicHolidays = returnPHCountry(country);

    Object.keys(publicHolidays).forEach(function (key) {
        All_Leaves = [...All_Leaves, ...publicHolidays[key]];
    });
    return All_Leaves;
};

export const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const tootlTipText = "Reconciled percent will be grayed out";

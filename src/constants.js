export const Jan_leaves = ["01/01/2024", "01/15/2024", "01/26/2024"];
export const Apr_leaves = ["04/09/2024", "04/11/2024"];
export const May_leaves = ["05/01/2024"];
export const Aug_leaves = ["08/15/2024"];
export const Oct_leaves = ["10/02/2024", "10/11/2024", "10/31/2024"];
export const Nov_leaves = ["11/01/2024"];
export const Dec_leaves = ["12/25/2024"];

export const publicHolidaysInd = {
    0: ["01/01/2024", "01/15/2024", "01/26/2024"],
    1: [],
    2: [],
    3: ["04/09/2024", "04/11/2024"],
    4: ["05/01/2024"],
    5: [],
    6: [],
    7: [],
    8: [],
    9: ["10/02/2024", "10/11/2024", "10/31/2024"],
    10: ["11/01/2024"],
    11: ["12/25/2024"],
};

export const allLeaves = () => {
    let All_Leaves = [];
    Object.keys(publicHolidaysInd).forEach(function (key) {
        All_Leaves = [...All_Leaves, ...publicHolidaysInd[key]];
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

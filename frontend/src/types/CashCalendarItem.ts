export type CashCalendarItem = {
    cashDate: string;
    incomeTotal: number;
    expenseTotal: number;
};

export type CashDailyItem = {
    cashId: number;
    kind: "INCOME" | "EXPENSE";
    money: number;
    memo?: string;
    cashDate: string;

    hashtags?: string[];
};

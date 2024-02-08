export const convertNotationToObject = (notation: string, nestedValue):any => {
    let object = {}
    let pointer = object;
    notation.split('.').map( (key, index, arr) => {
      pointer = (pointer[key] = (index == arr.length - 1? nestedValue: {}))
    });
    return object;
}

export const monthDiff = (d1: Date, d2: Date) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};

export const weeksDiff =  (d1, d2) => Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));

export const daysDiff = (d1, d2) => {
  const dueDateTime = new Date(d1).getTime();
  const currentDateTime = new Date(d2).getTime();
  const overdueMilliseconds = Math.max(0, currentDateTime - dueDateTime);
  const overdueDays = Math.ceil(overdueMilliseconds / (1000 * 60 * 60 * 24));
  return overdueDays;
};

export const getBill = (dueAmount: number, dueDate: Date) => {
  // Calculate overdue months
  const overdueMonths = monthDiff(dueDate , new Date(new Date().setDate(new Date().getDate() + 1)));
  // Calculate overdue weeks
  const overdueWeeks = weeksDiff(dueDate , new Date(new Date().setDate(new Date().getDate() + 1)));

  // Calculate overdue days
  const overdueDays = daysDiff(dueDate, new Date(new Date().setDate(new Date().getDate() + 1)));

  // Calculate overdue charge
  const overdueCharge = calculateOverdueCharge(Number(dueAmount), (overdueDays > 1 ? overdueDays - 1 : 0));

  // Calculate total amount
  const totalDueAmount = Number(dueAmount) + overdueCharge;

  return {
    dueAmount: Number(dueAmount).toFixed(2),
    overdueDays: overdueDays > 0 ? overdueDays - 1 : 0,
    overdueWeeks,
    overdueMonths,
    overdueCharge: Number(overdueCharge).toFixed(2),
    totalDueAmount: Number(totalDueAmount).toFixed(2)
  };
};

const calculateOverdueCharge = (dueAmount, overdueDays) => {
  const overdueChargeRate = 0.02; // 2% per day
  const overdueCharge = dueAmount * overdueChargeRate * overdueDays;
  return overdueCharge;
};

const dateRange = (startDate, endDate) => {
  // we use UTC methods so that timezone isn't considered
  let start: any = new Date(startDate);
  const end = new Date(endDate).setUTCHours(12);
  const dates = [];
  while (start <= end) {
    // compensate for zero-based months in display
    const displayMonth = start.getUTCMonth() + 1;
    dates.push([
      start.getUTCFullYear(),
      // months are zero based, ensure leading zero
      (displayMonth).toString().padStart(2, '0'),
      // always display the first of the month
      start.getDate(),
    ].join('-'));

    // progress the start date by one month
    start = new Date(start.setUTCMonth(displayMonth));
  }

  return dates;
}

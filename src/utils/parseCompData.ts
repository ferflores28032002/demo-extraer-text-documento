// Function to parse the data

const defaultValue = "No Existe";

export const parseCompData = (data: any) => {
  const details = data.rows.map((row: any) => ({
    inciso: row[0] || defaultValue,
    concept: row[1] || defaultValue,
    price: row[2] || defaultValue,
    unit: row[3] || defaultValue,
    update: row[4] || defaultValue,
    payment: row[5] || defaultValue,
  }));

  return [{ details }];
};

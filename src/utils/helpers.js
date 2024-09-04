export const aggregateDataByKey = (data, key) => {
    return data.reduce((acc, item) => {
      const value = item[key];
      const amount = parseFloat(item.montant_achat);
      acc[value] = (acc[value] || 0) + amount;
      return acc;
    }, {});
  };
  
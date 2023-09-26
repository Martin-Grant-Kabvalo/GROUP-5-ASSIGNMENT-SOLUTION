const monthlyPurchasesData = [
    { month: "Jan", purchases: 130000 },
    { month: "Feb", purchases: 147000 },
    { month: "Mar", purchases: 123000 },
    { month: "Apr", purchases: 165000 },
    { month: "May", purchases: 132000 }
];

const monthlySalesData = [
    { month: "Jan", sales: 150000 },
    { month: "Feb", sales: 160000 },
    { month: "Mar", sales: 140000 },
    { month: "Apr", sales: 170000 },
    { month: "May", sales: 155000 }
];


const monthlyExpensesData = [
    { month: "Jan", expenses: 2500 },
    { month: "Feb", expenses: 2800 },
    { month: "Mar", expenses: 2200 },
    { month: "Apr", expenses: 2600 },
    { month: "May", expenses: 2400 },
];


const monthlyGrossProfitData = [
    { month: "Jan", grossProfit: monthlySalesData[0].sales - monthlyPurchasesData[0].purchases },
    { month: "Feb", grossProfit: monthlySalesData[1].sales - monthlyPurchasesData[1].purchases },
    { month: "Mar", grossProfit: monthlySalesData[2].sales - monthlyPurchasesData[2].purchases },
    { month: "Apr", grossProfit: monthlySalesData[3].sales - monthlyPurchasesData[3].purchases },
    { month: "May", grossProfit: monthlySalesData[4].sales - monthlyPurchasesData[4].purchases }
];

const monthlyNetProfitData = [
    { month: "Jan", netProfit: monthlyGrossProfitData[0].grossProfit - monthlyExpensesData[0].expenses },
    { month: "Feb", netProfit: monthlyGrossProfitData[1].grossProfit - monthlyExpensesData[1].expenses },
    { month: "Mar", netProfit: monthlyGrossProfitData[2].grossProfit - monthlyExpensesData[2].expenses },
    { month: "Apr", netProfit: monthlyGrossProfitData[3].grossProfit - monthlyExpensesData[3].expenses },
    { month: "May", netProfit: monthlyGrossProfitData[4].grossProfit - monthlyExpensesData[4].expenses }
];

const revenueGrowthData = [
    { month: "Feb", growthRate: ((monthlySalesData[1].sales - monthlySalesData[0].sales) / monthlySalesData[0].sales) * 100 },
    { month: "Mar", growthRate: ((monthlySalesData[2].sales - monthlySalesData[1].sales) / monthlySalesData[1].sales) * 100 },
    { month: "Apr", growthRate: ((monthlySalesData[3].sales - monthlySalesData[2].sales) / monthlySalesData[2].sales) * 100 },
    { month: "May", growthRate: ((monthlySalesData[4].sales - monthlySalesData[3].sales) / monthlySalesData[3].sales) * 100 }
];


module.exports = {
    monthlyPurchasesData,
    monthlySalesData,
    monthlyExpensesData,
    monthlyGrossProfitData,
    monthlyNetProfitData,
    revenueGrowthData,
};

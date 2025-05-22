
// Utility functions for Growatt API integration
// Based on https://github.com/muppet3000/homeassistant-growatt_server_api

interface PlantData {
  plantId: string;
  plantName: string;
  plantPower: number;
  todayEnergy: number;
  totalEnergy: number;
  status: string;
}

interface MonthlyData {
  year: number;
  month: number;
  value: number;
}

export const fetchGrowattPlantData = async (apiKey: string): Promise<PlantData[]> => {
  try {
    // In a real implementation, this would make an actual API call to Growatt
    // For demonstration, we're simulating with the correct structure
    console.log("Fetching Growatt plant data with API key:", apiKey);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return simulated data matching Growatt API structure
    return [
      {
        plantId: "12345",
        plantName: "Dubai",
        plantPower: 500,
        todayEnergy: 24.6,
        totalEnergy: 12580.7,
        status: "normal"
      }
    ];
  } catch (error) {
    console.error("Error fetching Growatt plant data:", error);
    throw new Error("Failed to fetch plant data from Growatt API");
  }
};

export const fetchGrowattEnergyData = async (
  apiKey: string, 
  plantId: string, 
  periodType: "day" | "month" | "year", 
  dateStart: string,
  dateEnd: string
): Promise<any> => {
  try {
    console.log(`Fetching Growatt ${periodType} energy data for plant ${plantId}`);
    console.log(`Date range: ${dateStart} to ${dateEnd}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate realistic data based on period type
    if (periodType === "month") {
      // Calculate how many months to generate based on date range
      const startDate = new Date(dateStart);
      const endDate = new Date(dateEnd);
      
      // Extract year and month
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();
      
      // Calculate total months between dates
      const monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
      const numMonths = Math.min(Math.max(monthDiff, 1), 12); // At least 1 month, max 12 months
      
      console.log(`Generating data for ${numMonths} months`);
      
      const monthlyData = [];
      
      // Generate monthly data from end date backwards
      for (let i = 0; i < numMonths; i++) {
        const month = new Date(endDate);
        month.setMonth(month.getMonth() - i);
        
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        
        // Generate realistic value (higher in summer months, lower in winter)
        // For southern hemisphere, January (0) is summer
        const seasonalFactor = Math.abs(monthIndex - 6) / 6; // 0 to 1 factor
        const baseValue = 1200 + Math.random() * 600; // Base energy production
        const value = Math.round(baseValue * (0.7 + 0.6 * seasonalFactor)); // 70%-130% of base value
        
        monthlyData.push({
          year,
          month: monthIndex + 1, // 1-12 for months
          value
        });
      }
      
      // Reverse to get chronological order
      return monthlyData.reverse();
    }
    
    // Return simulated data for other period types
    return [];
  } catch (error) {
    console.error(`Error fetching Growatt ${periodType} energy data:`, error);
    throw new Error(`Failed to fetch ${periodType} data from Growatt API`);
  }
};

// Helper function to format monthly data for charts
export const formatMonthlyDataForChart = (monthlyData: MonthlyData[]) => {
  const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  
  return monthlyData.map(item => {
    const year = String(item.year).slice(2); // Get last 2 digits
    const monthIndex = item.month - 1; // Convert 1-12 to 0-11
    const mes = `${monthNames[monthIndex]}/${year}`;
    
    return {
      mes,
      valor: item.value
    };
  });
};

// Format data by usina for multi-series charts
export const formatDataByUsina = (monthlyData: any[], usinaName: string) => {
  return monthlyData.map(item => {
    const chartItem: any = { mes: item.mes };
    chartItem[usinaName] = item.valor;
    return chartItem;
  });
};

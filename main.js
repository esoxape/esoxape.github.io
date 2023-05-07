const fetchSMHIData = async (timeRange) => {
  const apiUrl = "https://opendata-download-metobs.smhi.se/api/";
  const version = "version/1.0/";
  const parameterId = "parameter/11";
  const stationId = "station/86655";
  const period = "latest-months";
  const format = ".json";

  const requestUrl = `${apiUrl}${version}${parameterId}/${stationId}/period/${period}/data${format}`;

  try {
    const response = await fetch(requestUrl);
    const data = await response.json();
    const now = new Date();
    const filteredData = data.value.filter((item) => {
      const itemDate = new Date(item.date);
      const timeDifference = now - itemDate;
      switch (timeRange) {
        case "week":
          return timeDifference < 7 * 24 * 60 * 60 * 1000;
        case "month":
          return timeDifference < 30 * 24 * 60 * 60 * 1000;
        case "quarter":
          return timeDifference < 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
    return filteredData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const processData = (data) => {
  const dailyData = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!dailyData[dateString]) {
      dailyData[dateString] = 0;
    }
    dailyData[dateString] += parseFloat(item.value);
  });

  // Filter out dates with no data
  const filteredData = Object.fromEntries(
    Object.entries(dailyData).filter(([_, value]) => value > 0)
  );

  return filteredData;
};


let chartInstance = null;

const drawBarGraph = (data) => {
  const ctx = document.getElementById("barGraph").getContext("2d");
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total value per day",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};



const init = async (timeRange = "month") => {
  try {
    const rawData = await fetchSMHIData(timeRange);
    console.log('Raw data:', rawData);

    const dailyData = processData(rawData);
    console.log('Daily data:', dailyData);

    drawBarGraph(dailyData);
  } catch (error) {
    console.error("Error in init function:", error);
  }
};

init();

document.getElementById("pastWeek").addEventListener("click", () => {init("week");
});

document.getElementById("pastMonth").addEventListener("click", () => {init("month");
});

document.getElementById("pastQuarter").addEventListener("click", () => {
  init("quarter");
});


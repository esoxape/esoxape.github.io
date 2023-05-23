const fetchSMHIData = async (stationId, timeRange) => {
  const apiUrl = "https://opendata-download-metobs.smhi.se/api/";
  const version = "version/1.0/";
  const parameterId = "parameter/11";
  const period = "latest-months";
  const format = ".json";

  const requestUrl = `${apiUrl}${version}${parameterId}/station/${stationId}/period/${period}/data${format}`;

  try {
    const response = await fetch(requestUrl);
    const data = await response.json();
    const now = new Date();
	const firstDayTimestamp = data.value[0] ? new Date(data.value[0].date).getTime() : null;
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

  const filteredData = Object.fromEntries(
    Object.entries(dailyData).filter(([_, value]) => value > 0)
  );

  return filteredData;
};


let chartInstance = null;

const drawBarGraph = (data1, data2) => {
  const ctx = document.getElementById("barGraph").getContext("2d");

  const labels1 = Object.keys(data1);
  const labels2 = Object.keys(data2);

  // Create a set of unique labels
  const labels = Array.from(new Set(labels1.concat(labels2)));

  // Map the labels to the corresponding values from each dataset
  const values1 = labels.map(label => data1[label] || 0);
  const values2 = labels.map(label => data2[label] || 0);

  // Remove the first day of data
  labels.shift();
  values1.shift();
  values2.shift();

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Selected station",
          data: values1,
          backgroundColor: "rgba(33, 33, 33, 0.2)",
          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 1,
        },
        {
          label: "Norrköping",
          data: values2,
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderColor: "rgba(0, 0, 255, 1)",
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
          ticks: {
            font: {
              size: 24, // Set the font size for y-axis labels
            },
          },
        },
        x: {
          ticks: {
            font: {
              size: 24, // Set the font size for x-axis labels
            },
          },
        },
      },
      plugins: {
        tooltip: {
          displayColors: false,
          bodyFont: {
            size: 30, // Set the font size for tooltip body text
          },
          titleFont: {
            size: 30, // Set the font size for tooltip title text
          },
        },
      },
    },
  });
};







let selectedStationId = "105285";  // Default station ID

const stationSelect = document.getElementById("stationSelect");
stationSelect.addEventListener("change", (event) => {
  selectedStationId = event.target.value;
  init();
});

const init = async (timeRange = "month") => {
  try {
    const rawData1 = await fetchSMHIData(selectedStationId, timeRange);
    const rawData2 = await fetchSMHIData("86655", timeRange);  // Change this to another station ID if needed

    const dailyData1 = processData(rawData1);
    const dailyData2 = processData(rawData2);

    drawBarGraph(dailyData1, dailyData2);
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


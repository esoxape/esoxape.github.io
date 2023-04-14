const processSMHIData = (data) => {
  const daysData = data.value.map((value) => {
    const date = new Date(value.date);
    return {
      day: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      value: value.value,
    };
  });

  return daysData;
};

const drawGraph = (daysData) => {
  const ctx = document.getElementById('gameCanvas').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: daysData.map((data) => data.day),
      datasets: [
        {
          label: 'ParameterID Total',
          data: daysData.map((data) => data.value),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Days',
          },
        },
        y: {
          title: {
            display: true,
            text: 'ParameterID Total',
          },
        },
      },
    },
  });
};

const fetchSMHIData = async () => {
  const apiUrl = "https://opendata-download-metobs.smhi.se/api/";
  const version = "version/1.0/";
  const parameterId = "parameter/11"; // Replace with the desired parameter ID
  const stationId = "station/86655"; // Replace with the desired station ID
  const period = "latest-months"; // You can change this to "latest-day", "latest-months", or "corrected-archive" as needed
  const format = ".json";

  const requestUrl = `${apiUrl}${version}${parameterId}/${stationId}/period/${period}/data${format}`;

  try {
    const response = await fetch(requestUrl);
    const data = await response.json();
    console.log(data);

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const filteredData = data.value.filter((value) => {
      const date = new Date(value.date);
      return date >= oneMonthAgo && date <= today;
    });

    const daysData = processSMHIData({ value: filteredData });
    drawGraph(daysData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchSMHIData();

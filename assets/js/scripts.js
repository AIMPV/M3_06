const clpValue = document.getElementById('CLP');
const selectedMoney = document.getElementById('selectMoney');
const convertBtn = document.getElementById('convert');
const resultValue = document.getElementById('result');
const urlBase = "https://mindicador.cl/api";
let myChart = null;

convertBtn.addEventListener("click", async () => {
  if (CLP.value <= 0) {
    showError("Debe ingresar un valor mayor a cero");
  } else {
    const moneyInfo = await getMoneyInfo(selectedMoney.value);
    const moneyValue = await searchMoneyType(selectedMoney.value);
    const finalAmount = (CLP.value / moneyValue).toFixed(2);
    resultValue.innerHTML = `$${CLP.value} corresponden a ${finalAmount} ${moneyInfo.nombre}`;
  }
});

const getMoneyInfo = async (moneyType) => {
  try {
    const res = await fetch(`${urlBase}/${moneyType}`);
    const data = await res.json();
    return data;
  } catch (error) {
    alert("Hubo un error al obtener la información de la moneda. Por favor, inténtelo de nuevo.");
  }
};

const searchMoneyType = async (moneyType) => {
  try {
    const res = await fetch(`${urlBase}/${moneyType}`);
    const data = await res.json();
    let serie = data.serie.slice(0, 10);

    let chartData = createDataToChart(serie, data.nombre);

    if (myChart) {
      myChart.destroy();
    }

    chartRender(chartData);
    return serie[0].valor;
  } catch (error) {
    alert("Hubo un error al obtener la información. Por favor, inténtelo de nuevo.");
  }
};

const createDataToChart = (chartData, moneyName) => {
  const labels = chartData.map((dat) => {
    const fecha = new Date(dat.fecha);
    return fecha.toLocaleDateString('en-GB');
  });
  const valor = chartData.map((dat) => dat.valor);

  const datasets = [
    {
      label: moneyName,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132,0.25)",
      pointBorderWidth: 10,
      data: valor,
    },
  ];
  return { labels, datasets };
};

const chartRender = (data) => {
  const config = {
    type: "line",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 16,
            }
          }
        },
        title: {
          display: true,
          text: 'Historial 10 dias',
          font: {
            size: 24,
            weight: "normal",
          }
        }
      },
      scales: {
        x: {
          reverse: true,
        },
      },
    },
  };

  if (myChart) {
    myChart.destroy();
  }

  const canvas = document.getElementById("myChart");
  myChart = new Chart(canvas, config);
};

function showError(message) {
  const errorMessageElement = document.getElementById('errorMessage');
  errorMessageElement.textContent = message;

  const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
  errorModal.show();
}

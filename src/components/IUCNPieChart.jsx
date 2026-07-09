import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend); // Register the necessary Chart.js components for the pie chart

function IUCNPieChart({ statusCounts, countryInfo }) {
    console.log("Received statusCounts in IUCNPieChart:", statusCounts); // Debug log to check the received statusCounts prop
    console.log("Received countryInfo in IUCNPieChart:", countryInfo); // Debug log to check the received countryInfo prop
  const labels = {
    CR: "Critically Endangered",
    EN: "Endangered",
    VU: "Vulnerable",
    NT: "Near Threatened",
    LC: "Least Concern",
    DD: "Data Deficient",
    NE: "Not Evaluated",
    EX: "Extinct",
    EW: "Extinct in Wild",
  };
console.log("Status counts in IUCNPieChart:", statusCounts); // Debug log to check the statusCounts prop
  const data = {
    labels: Object.keys(statusCounts).map((key) => labels[key] || key),

    datasets: [
      {
        data: Object.values(statusCounts),

        backgroundColor: [
          "#dc3545", // CR
          "#fd7e14", // EN
          "#ffc107", // VU
          "#0dcaf0", // NT
          "#198754", // LC
          "#6c757d", // DD
          "#adb5bd", // NE
          "#212529", // EX
          "#495057", // EW
        ],
      },
    ],
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
       
         <Pie
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      }}
    />
    </div>
   
  );
}

export default IUCNPieChart;

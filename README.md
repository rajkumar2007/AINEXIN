<!DOCTYPE html>
<html>
<head>
  <title>Devops Besnift Dashboard (v14)</title>
  <style>
    body, h1, h2, p, label, input, button {
      margin: 0;
      padding: 1;
      border: 1;
      font-size: 100%;
      vertical-align: baseline;
    }
    body {
      background-color: #f2f2f2;
      color: #333;
      font-family: 'Arial', sans-serif;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
    .column {
      flex-basis: calc(10.333% - 16px);
      background-color: #fff;
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1, h2 {
      margin-bottom: 20px;
    }
    label, input, p {
      margin-bottom: 20px;
    }
    button {
      padding: 12px 24px;
      background-color: #007BFF;
      color: white;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  </style>
  <script>
    function calculateAllMetrics() {
      const commonFormula = (oldVal, newVal) => ((oldVal - newVal) / oldVal) * 100;
      const metrics = [
        "EpicCycleTime", "StoryCycleTime", "FirstCommitToDeploy", "LastCommitToDeploy",
        "NumberOfDeployments", "MeanTimeToAcknowledge", "MeanTimeToRecover", "ChangeFailureRate",
        "DeploymentFrequency", "LeadTimeForChanges", "TimeToRecover", "ErrorRates",
        "PerformanceMetrics", "ComplianceScore", "Velocity", "CommitToDeployTime",
        "EmployeeSatisfaction", "SecurityRating", "HotspotsReviewed", "SecurityRiskScore"
      ];
      let overallBenefit = 0;

       metrics.forEach(metric => {
    const oldVal = parseFloat(document.getElementById(`old${metric}`).value);
    const newVal = parseFloat(document.getElementById(`new${metric}`).value);
    const benefit = commonFormula(oldVal, newVal);
    document.getElementById(`${metric}Benefit`).innerText = benefit.toFixed(2) + "%";
    overallBenefit += benefit;
  });

  const getSRSValue = (blocker, critical, major, minor) => {
  return 4 * parseFloat(blocker || 0) + 
         3 * parseFloat(critical || 0) + 
         2 * parseFloat(major || 0) + 
         1 * parseFloat(minor || 0);
};

const oldSRS = getSRSValue(
  document.getElementById('oldBlocker').value,
  document.getElementById('oldCritical').value,
  document.getElementById('oldMajor').value,
  document.getElementById('oldMinor').value
);

const newSRS = getSRSValue(
  document.getElementById('newBlocker').value,
  document.getElementById('newCritical').value,
  document.getElementById('newMajor').value,
  document.getElementById('newMinor').value
);

// Calculate benefit for SRS
const srsBenefit = commonFormula(oldSRS, newSRS);
document.getElementById('SRSBenefit').innerText = srsBenefit.toFixed(2) + "%";

// Calculate individual percentages
const getOldPercentage = (oldSRS) => {
  const total = 4 + 3 + 2 + 1;  // Sum of weights for Blocker, Critical, Major, Minor
  return ((oldSRS / total) * 100).toFixed(2);
};

const getNewPercentage = (newSRS) => {
  const total = 4 + 3 + 2 + 1;  // Sum of weights for Blocker, Critical, Major, Minor
  return ((newSRS / total) * 100).toFixed(2);
};

const oldSRSPerc = getOldPercentage(oldSRS);
const newSRSPerc = getNewPercentage(newSRS);

// Calculate security rating for old and new SRS
const getSecurityRating = (srsBenefitPercentage) => {
  if (srsBenefitPercentage >= 80) return 'A';
  if (srsBenefitPercentage >= 60 && srsBenefitPercentage < 80) return 'B';
  if (srsBenefitPercentage >= 40 && srsBenefitPercentage < 60) return 'C';
  if (srsBenefitPercentage >= 20 && srsBenefitPercentage < 40) return 'D';
  return 'F';
};

document.getElementById('OldSecurityRating').innerText = getSecurityRating(oldSRSPerc);
document.getElementById('NewSecurityRating').innerText = getSecurityRating(newSRSPerc);


  const overallDevOpsBenefit = overallBenefit / (metrics.length + 1); // +1 for SRS
  document.getElementById("OverallBenefit").innerText = overallDevOpsBenefit.toFixed(2) + "%";
}
 
    
      //  CSV export code here

function exportToCSV() {
  const metrics = [
    "EpicCycleTime", "StoryCycleTime", "FirstCommitToDeploy", "LastCommitToDeploy",
    "NumberOfDeployments", "MeanTimeToAcknowledge", "MeanTimeToRecover", "ChangeFailureRate",
    "DeploymentFrequency", "LeadTimeForChanges", "TimeToRecover", "ErrorRates",
    "PerformanceMetrics", "ComplianceScore", "Velocity", "CommitToDeployTime",
    "EmployeeSatisfaction", "SecurityRating", "HotspotsReviewed", "SecurityRiskScore"
  ];
  
  const srsFields = ['oldBlocker', 'oldCritical', 'oldMajor', 'oldMinor',"oldSecurityRating", 'newBlocker', 'newCritical', 'newMajor', 'newMinor'];
  
  let csvContent = 'Metric,Old Value,New Value,Benefit, , NewSecurityRating\n';

  metrics.forEach(metric => {
    const oldVal = document.getElementById(`old${metric}`).value;
    const newVal = document.getElementById(`new${metric}`).value;
    const benefit = document.getElementById(`${metric}Benefit`).innerText;
    csvContent += `${metric},${oldVal},${newVal},${benefit}\n`;
  });

  // Add SRS metrics
  srsFields.forEach(field => {
    const value = document.getElementById(field).value;
    csvContent += `SRS_${field},${value},,\n`;
  });
  
  // Add SRS Benefit, Old and New Security Rating
  const srsBenefit = document.getElementById('SRSBenefit').innerText;
  const oldSecurityRating = document.getElementById('OldSecurityRating').innerText;
  const newSecurityRating = document.getElementById('NewSecurityRating').innerText;
  
  csvContent += `SRS_Benefit,,,${srsBenefit}\n`;
  csvContent += `Old_Security_Rating,,${oldSecurityRating},\n`;
  csvContent += `New_Security_Rating,,${newSecurityRating},\n`;
  
  // Create CSV download
  const blob = new Blob([csvContent], {type: 'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'DevOps_Metrics_Dashboard.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

    
  </script>
</head>
<body>
  <h1>Devops Besnift Dashboard (v14)</h1>
  <label for="appName">Application Name:</label>
  <input type="text" id="appName">

  <div class="container">
    <script>
      const metrics = [
        "EpicCycleTime", "StoryCycleTime", "FirstCommitToDeploy", "LastCommitToDeploy",
        "NumberOfDeployments", "MeanTimeToAcknowledge", "MeanTimeToRecover", "ChangeFailureRate",
        "DeploymentFrequency", "LeadTimeForChanges", "TimeToRecover", "ErrorRates",
        "PerformanceMetrics", "ComplianceScore", "Velocity", "CommitToDeployTime",
        "EmployeeSatisfaction", "SecurityRating", "HotspotsReviewed", "SecurityRiskScore"
      ];

      metrics.forEach(metric => {
        document.write(`
          <div class="column">
            <h2>${metric.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <label for="old${metric}">Old ${metric.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input type="number" id="old${metric}">
            <label for="new${metric}">New ${metric.replace(/([A-Z])/g, ' $1').trim()}:</label>
            <input type="number" id="new${metric}">
            <p>${metric.replace(/([A-Z])/g, ' $1').trim()} Benefit: <span id="${metric}Benefit">N/A</span></p>
          </div>
        `);
      });
    </script>

    <div class="column">
      <h2>Security Risk Score (SRS)</h2>
      <label for="oldBlocker">Old Blocker:</label>
      <input type="number" id="oldBlocker">
      <label for="oldCritical">Old Critical:</label>
      <input type="number" id="oldCritical">
      <label for="oldMajor">Old Major:</label>
      <input type="number" id="oldMajor">
      <label for="oldMinor">Old Minor:</label>
      <input type="number" id="oldMinor">
      <label for="newBlocker">New Blocker:</label>
      <input type="number" id="newBlocker">
      <label for="newCritical">New Critical:</label>
      <input type="number" id="newCritical">
      <label for="newMajor">New Major:</label>
      <input type="number" id="newMajor">
      <label for="newMinor">New Minor:</label>
      <input type="number" id="newMinor">
       <p>SRS Benefit: <span id="SRSBenefit">N/A</span></p>
    <p>Old Security Rating: <span id="OldSecurityRating">N/A</span></p>
    <p>New Security Rating: <span id="NewSecurityRating">N/A</span></p>
  </div>
    </div>
  </div>

<!-- Calculate and Export Buttons -->
  <div style="text-align: center; margin-top: 20px;">
    <button onclick="calculateAllMetrics()">Calculate All Metrics</button>
    <button onclick="exportToCSV()">Export to CSV</button>
  </div>


  <h2>Overall DevOps Benefit</h2>
  <p>Overall Benefit: <span id="OverallBenefit">N/A</span></p>

</body>
</html>

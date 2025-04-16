const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a random date within a range
 */
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Format date as ISO string
 */
function formatDate(date) {
  return date.toISOString();
}

/**
 * Generate a random report
 */
function generateRandomReport(index) {
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  const reportDate = randomDate(oneYearAgo, now);
  
  const patientNames = [
    'John Smith', 'Jane Doe', 'Bob Johnson', 'Sarah Williams',
    'Michael Brown', 'Emily Davis', 'David Wilson', 'Lisa Johnson'
  ];
  
  const reportTypes = [
    'General', 'Lab', 'Radiology', 'Cardiology', 'Pulmonology',
    'Neurology', 'Dermatology', 'Obstetrics', 'Endocrinology'
  ];
  
  const summaries = [
    'Patient presented with mild fever and cough. Chest X-ray shows no signs of pneumonia.',
    'Blood test reveals elevated cholesterol levels. Patient also shows signs of tachycardia during physical examination.',
    'MRI scan of right knee shows minor tear in the meniscus. Physical therapy recommended.',
    'Patient reports intermittent chest pain. ECG shows possible arrhythmia. Referred to cardiologist.',
    'Annual checkup shows all vital signs within normal ranges. Vaccination status updated.',
    'Patient complains of persistent headaches. CT scan shows no abnormalities.',
    'Follow-up for respiratory infection. Symptoms have improved.',
    'Dermatology examination for skin rash. Diagnosed as contact dermatitis.',
    'Post-surgery follow-up. Incision healing well with no signs of infection.',
    'Prenatal checkup. Fetal heartbeat normal, fundal height appropriate for gestational age.'
  ];
  
  const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
  const patientId = `P${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
  const type = reportTypes[Math.floor(Math.random() * reportTypes.length)];
  const summary = summaries[Math.floor(Math.random() * summaries.length)];
  
  return {
    id: index.toString(),
    patientName,
    patientId,
    date: formatDate(reportDate),
    summary,
    type,
    createdAt: formatDate(reportDate),
    updatedAt: formatDate(reportDate)
  };
}

/**
 * Generate test reports data
 */
function generateTestData(count) {
  const reports = [];
  
  for (let i = 1; i <= count; i++) {
    reports.push(generateRandomReport(i));
  }
  
  return reports;
}

/**
 * Write test data to file
 */
function writeTestData(filePath, count = 20) {
  const data = generateTestData(count);
  const dataString = JSON.stringify(data, null, 2);
  
  // Ensure directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, dataString);
  console.log(`Generated ${count} test reports at ${filePath}`);
}

// If this script is run directly
if (require.main === module) {
  const count = process.argv[2] || 20;
  const filePath = process.argv[3] || path.join(__dirname, '../tests/fixtures/reports.json');
  
  writeTestData(filePath, parseInt(count, 10));
}

module.exports = {
    generateRandomReport,
    generateTestData,
    writeTestData
  };
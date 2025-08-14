// Helper function to generate daily sequential numbers
export function generateDailyPatientNumber(patients, scheduledTime) {
  const surgeryDate = new Date(scheduledTime);
  const surgeryDateStr = surgeryDate.toDateString();
  
  // Filter patients for the same day and sort by scheduled time
  const sameDayPatients = patients
    .filter(p => {
      const patientDate = new Date(p.scheduledTime);
      return patientDate.toDateString() === surgeryDateStr;
    })
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
  
  // Find the position of this surgery time
  const surgeryTime = surgeryDate.getTime();
  let position = 1;
  
  for (const patient of sameDayPatients) {
    const patientTime = new Date(patient.scheduledTime).getTime();
    if (patientTime < surgeryTime) {
      position++;
    }
  }
  
  return position.toString().padStart(3, '0');
}

// Mock data store - replace with actual API calls
let mockPatients = [];

// Generate comprehensive patient data from yesterday to August 15, 2025
const generatePatientData = () => {
  const patients = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const endDate = new Date('2025-08-15');
  
  const procedures = [
    'Appendectomy', 'Gallbladder Surgery', 'Hernia Repair', 'Knee Replacement',
    'Hip Replacement', 'Cataract Surgery', 'Coronary Bypass', 'Tonsillectomy',
    'Cholecystectomy', 'Arthroscopy', 'Mastectomy', 'Prostatectomy',
    'Thyroidectomy', 'Spinal Fusion', 'Carpal Tunnel Surgery', 'Rhinoplasty',
    'Gastric Bypass', 'Colon Surgery', 'Lung Surgery', 'Brain Surgery',
    'Shoulder Surgery', 'ACL Repair', 'Rotator Cuff Repair', 'Bunion Surgery',
    'Deviated Septum Surgery', 'Endoscopy', 'Laparoscopy', 'Biopsy'
  ];
  
  const surgeons = [
    'Dr. Johnson', 'Dr. Chen', 'Dr. Martinez', 'Dr. Smith', 'Dr. Davis',
    'Dr. Wilson', 'Dr. Brown', 'Dr. Taylor', 'Dr. Anderson', 'Dr. Thompson',
    'Dr. Garcia', 'Dr. Rodriguez', 'Dr. Lewis', 'Dr. Walker', 'Dr. Hall',
    'Dr. Allen', 'Dr. Young', 'Dr. King', 'Dr. Wright', 'Dr. Lopez'
  ];
  
  const statuses = ['scheduled', 'checked-in', 'pre-procedure', 'in-progress', 'closing', 'recovery', 'complete', 'dismissal'];
  
  const firstNames = [
    'John', 'Mary', 'Robert', 'Sarah', 'Michael', 'Jennifer', 'William', 'Linda',
    'David', 'Elizabeth', 'Richard', 'Patricia', 'Joseph', 'Jessica', 'Thomas',
    'Susan', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
    'Paul', 'Carol', 'Steven', 'Ruth', 'Kenneth', 'Sharon', 'Joshua', 'Michelle',
    'Kevin', 'Laura', 'Brian', 'Sarah', 'George', 'Kimberly', 'Edward', 'Deborah',
    'Ronald', 'Dorothy', 'Timothy', 'Amy', 'Jason', 'Angela', 'Jeffrey', 'Brenda'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen',
    'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera'
  ];
  
  const times = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];
  
  let patientId = 1;
  
  // Generate patients for each day from yesterday to August 15, 2025
  for (let date = new Date(yesterday); date <= endDate; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);
    const patientsPerDay = Math.floor(Math.random() * 6) + 5; // 5-10 patients per day
    
    for (let i = 0; i < patientsPerDay; i++) {
      const scheduledTime = new Date(currentDate);
      const timeSlot = times[i % times.length];
      const [time, period] = timeSlot.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) hour24 += 12;
      if (period === 'AM' && hours === 12) hour24 = 0;
      
      scheduledTime.setHours(hour24, minutes, 0, 0);
      
      // Determine status based on date relative to today
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const patientDate = new Date(currentDate);
      patientDate.setHours(0, 0, 0, 0);
      
      let status;
      if (patientDate < todayDate) {
        // Past dates - mostly completed or dismissed
        const pastStatuses = ['complete', 'dismissal', 'recovery'];
        const weights = [0.6, 0.3, 0.1]; // 60% complete, 30% dismissal, 10% recovery
        const rand = Math.random();
        if (rand < weights[0]) status = 'complete';
        else if (rand < weights[0] + weights[1]) status = 'dismissal';
        else status = 'recovery';
      } else if (patientDate.getTime() === todayDate.getTime()) {
        // Today - mix of all active statuses based on time
        const currentHour = new Date().getHours();
        if (hour24 > currentHour + 2) {
          status = 'scheduled';
        } else if (hour24 > currentHour) {
          status = Math.random() < 0.5 ? 'scheduled' : 'checked-in';
        } else {
          const activeStatuses = ['checked-in', 'pre-procedure', 'in-progress', 'closing', 'recovery', 'complete'];
          status = activeStatuses[Math.floor(Math.random() * activeStatuses.length)];
        }
      } else {
        // Future dates - mostly scheduled
        status = Math.random() < 0.9 ? 'scheduled' : 'checked-in';
      }
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const procedure = procedures[Math.floor(Math.random() * procedures.length)];
      const surgeon = surgeons[Math.floor(Math.random() * surgeons.length)];
      const estimatedTime = timeSlot;
      
      // Generate notes for some patients
      const notes = Math.random() < 0.3 ? [
        'Patient has allergies to penicillin',
        'Previous surgery complications noted',
        'Requires special anesthesia protocol',
        'Family history of heart disease',
        'Patient is diabetic - monitor blood sugar',
        'High blood pressure - monitor vitals closely',
        'Patient requested private room',
        'Interpreter needed for Spanish',
        'Patient has pacemaker',
        'Previous adverse reaction to morphine'
      ][Math.floor(Math.random() * 10)] : undefined;
      
      const patient = {
        id: patientId.toString(),
        patientNumber: `P${patientId.toString().padStart(3, '0')}`,
        firstName,
        lastName,
        age: Math.floor(Math.random() * 60) + 20, // Age 20-80
        phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        room: `Room ${Math.floor(Math.random() * 400) + 100}`,
        procedure,
        surgeon,
        status,
        scheduledTime: scheduledTime.toISOString(),
        estimatedTime,
        actualStartTime: ['in-progress', 'closing', 'recovery', 'complete', 'dismissal'].includes(status) 
          ? new Date(scheduledTime.getTime() + Math.floor(Math.random() * 30) * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : undefined,
        createdAt: new Date(currentDate.getTime() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        notes
      };
      
      patients.push(patient);
      patientId++;
    }
  }
  
  return patients;
};

// Initialize patient data
mockPatients = generatePatientData();

export async function getPatients() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPatients;
}

export async function getPatient(id) {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockPatients.find(p => p.id === id) || null;
}

export async function createPatient(patient) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate patient number if not provided
  const patientNumber = patient.patientNumber || `P${(mockPatients.length + 1).toString().padStart(3, '0')}`;
  
  const newPatient = {
    ...patient,
    patientNumber,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockPatients.push(newPatient);
  return newPatient;
}

export async function updatePatientStatus(id, status, notes) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const patient = mockPatients.find(p => p.id === id);
  if (!patient) return null;
  
  patient.status = status;
  patient.updatedAt = new Date().toISOString();
  if (notes) patient.notes = notes;
  
  return patient;
}

export async function searchPatients(query) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const searchTerm = query.toLowerCase();
  return mockPatients.filter(p => 
    p.lastName.toLowerCase().includes(searchTerm) ||
    p.firstName.toLowerCase().includes(searchTerm) ||
    p.patientNumber.toLowerCase().includes(searchTerm)
  );
}
type Learner = {
  name: string;
  mark1: number;
  mark2: number;
  mark3: number;
};

function validateMark(mark: number): boolean {
  if (mark < 0 || mark > 100) {
    throw new Error("Marks must be between 0 and 100.");
  }
  return true;
}

function calculateAverage(m1: number, m2: number, m3: number): number {
  validateMark(m1);
  validateMark(m2);
  validateMark(m3);
  return (m1 + m2 + m3) / 3;
}

function determineGrade(average: number): string {
  if (average >= 80) {
    return "A";
  } else if (average >= 70) {
    return "B";
  } else if (average >= 60) {
    return "C";
  } else {
    return "Needs Improvement";
  }
}

function determineStatus(average: number): string {
  if (average >= 50) {
    return "Pass";
  } else {
    return "Fail";
  }
}

function displayResult(learner: Learner): void {
  let average = calculateAverage(learner.mark1, learner.mark2, learner.mark3);
  let grade = determineGrade(average);
  let status = determineStatus(average);

  console.log(`Name: ${learner.name}`);
  console.log(`Average: ${average.toFixed(1)}`);
  console.log(`Grade: ${grade}`);
  console.log(`Status: ${status}`);
  console.log("--------------------");
}

const learners: Learner[] = [
  { name: "Hira", mark1: 85, mark2: 82, mark3: 85 },
  { name: "Ali", mark1: 75, mark2: 78, mark3: 72 },
  { name: "Sara", mark1: 65, mark2: 62, mark3: 68 },
  { name: "Omar", mark1: 45, mark2: 40, mark3: 35 },
  { name: "Zainab", mark1: 95, mark2: 92, mark3: 98 },
];

for (const student of learners) {
  displayResult(student);
}

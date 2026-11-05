const inferredMarks = [75, 88, 91, 64, 82];
const explicitMarks: number[] = [75, 88, 91, 64, 82];

const marks: number[] = [...inferredMarks];

// marks.push("90");

if (marks.length > 0) {
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const average = total / marks.length;
  const highest = Math.max(...marks);
  const lowest = Math.min(...marks);

  console.log(`Marks: ${marks.join(", ")}`);
  console.log(`Total: ${total}`);
  console.log(`Average: ${average}`);
  console.log(`Highest: ${highest}`);
  console.log(`Lowest: ${lowest}`);
}

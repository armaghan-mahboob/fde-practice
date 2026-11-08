const employees: [number, string][] = [
  [201, "Bilal"],
  [202, "Sana"],
  [203, "Imran"],
];

for (const employee of employees) {
  console.log(`Employee ${employee[0]}: ${employee[1]}`);
}

employees[0][1] = "Bilal Ahmed";

// employees[0] = ["Bilal Ahmed", 201];

/*
An object is more readable when the data structure grows beyond two fields or when 
multiple fields share the same type. For example, { id: 201, name: "Bilal" } 
is much clearer than [201, "Bilal"] because the property names provide context. 
With tuples, developers must memorize what index 0 and index 1 represent, 
which becomes error-prone as the tuple length increases.
*/

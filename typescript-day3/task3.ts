type Identifier = string | number;

function normalizeIdentifier(id: Identifier): string {
  if (typeof id === "number") {
    return `DB-${String(id).padStart(4, "0")}`;
  }
  return id.toUpperCase();
}

function describeIdentifier(id: Identifier | null): string {
  if (id === null) {
    return "No identifier supplied";
  }
  if (typeof id === "number") {
    return `Numeric identifier: ${id}`;
  }
  return `Text identifier: ${id}`;
}

console.log(normalizeIdentifier(27));
console.log(normalizeIdentifier("emp-27"));
console.log(describeIdentifier(null));

/*
// String-only method cannot be called before narrowing (compiler error example):

const rawId: Identifier = 27;
// console.log(rawId.toUpperCase());
// Property 'toUpperCase' does not exist on type 'string | number'.
//   Property 'toUpperCase' does not exist on type 'number'.
*/

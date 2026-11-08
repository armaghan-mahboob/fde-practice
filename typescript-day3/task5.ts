interface EmailCustomer {
  name: string;
  customerId: number;
  email: string;
}

interface PhoneCustomer {
  name: string;
  customerId: number;
  phone: string;
}

type Customer = EmailCustomer | PhoneCustomer;

function getContactSummary(customer: Customer): string {
  if ("email" in customer) {
    return `Email customer ${customer.name}: ${customer.email}`;
  }
  return `Phone customer ${customer.name}: ${customer.phone}`;
}

const customers: Customer[] = [
  { name: "Mina", customerId: 101, email: "mina@example.com" },
  { name: "Ali", customerId: 102, phone: "+92-300-0000000" },
];

customers.forEach((customer) => {
  console.log(getContactSummary(customer));
});

/*
Why a shared property such as `name` cannot distinguish the variants:
Both EmailCustomer and PhoneCustomer declare `name: string`, so `"name" in customer`
is always true and TypeScript cannot narrow the union — it leaves the type as
`EmailCustomer | PhoneCustomer`. Only a property unique to one variant
(`email` or `phone`) can discriminate between them in an `in` check.

Incorrect property access before narrowing (compiler error example):

const untypedCustomer: Customer = customers[0];
// console.log(untypedCustomer.email);
// Property 'email' does not exist on type 'Customer'.
//   Property 'email' does not exist on type 'PhoneCustomer'.
*/

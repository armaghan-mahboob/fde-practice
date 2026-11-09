interface Customer {
  id: number;
  name: string;
}

interface Account {
  accountNumber: string;
  balance: number;
}

type CustomerAccount = Customer & Account;

interface RetailCustomer extends CustomerAccount {
  category: "retail";
  loyaltyPoints: number;
}

interface BusinessCustomer extends CustomerAccount {
  category: "business";
  taxId: string;
}

type CustomerCategory = RetailCustomer | BusinessCustomer;

function getAccountSummary(account: CustomerAccount): string {
  return `Customer: ${account.name}, Account: ${account.accountNumber}, Balance: PKR ${account.balance}`;
}

function getCategoryMessage(customer: CustomerCategory): string {
  if (customer.category === "retail") {
    return `Retail customer ${customer.name} has ${customer.loyaltyPoints} loyalty points.`;
  } else {
    return `Business customer ${customer.name} is registered with Tax ID: ${customer.taxId}.`;
  }
}

const retailCustomer: RetailCustomer = {
  id: 1,
  name: "Ali Khan",
  accountNumber: "ACC-1001",
  balance: 50000,
  category: "retail",
  loyaltyPoints: 250,
};

const businessCustomer: BusinessCustomer = {
  id: 2,
  name: "Sana Traders",
  accountNumber: "ACC-2001",
  balance: 1500000,
  category: "business",
  taxId: "TX-987654",
};

const anotherRetailCustomer: RetailCustomer = {
  id: 3,
  name: "Bilal Hussain",
  accountNumber: "ACC-1002",
  balance: 12000,
  category: "retail",
  loyaltyPoints: 80,
};

console.log(getAccountSummary(retailCustomer));
console.log(getCategoryMessage(retailCustomer));

console.log(getAccountSummary(businessCustomer));
console.log(getCategoryMessage(businessCustomer));

console.log(getAccountSummary(anotherRetailCustomer));
console.log(getCategoryMessage(anotherRetailCustomer));

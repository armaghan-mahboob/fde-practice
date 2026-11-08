const user1: {
  readonly id: number;
  name: string;
  email?: string;
  phone?: string;
} = {
  id: 1,
  name: "Ayesha",
  phone: "03001234567",
};

const user2: typeof user1 = {
  id: 2,
  name: "Sana",
  email: "sana@example.com",
  phone: "03119876543",
};

function displayProfile(user: typeof user1 | typeof user2): void {
  console.log(`Profile: ${user.name}`);
  console.log(`Email: ${user.email ?? "Not supplied"}`);
  console.log(`Phone: ${user.phone ?? "Not supplied"}`);

  if (user.email) {
    console.log(`Email length: ${user.email.length}`);
  }

  // console.log(user.email.length);

  // const invalidUser: UserProfile = { id: 3 };
}

displayProfile(user1);
console.log("-------------------");
displayProfile(user2);

import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcryptjs.hash("ElonBad69!", 10);

  await prisma.user.upsert({
    where: { email: "eric" },
    update: { password: passwordHash },
    create: {
      name: "Eric Downs",
      email: "eric",
      password: passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "marko" },
    update: { password: passwordHash },
    create: {
      name: "Marko Fazio",
      email: "marko",
      password: passwordHash,
    },
  });

  // Clean up old accounts
  await prisma.user.deleteMany({
    where: { email: { in: ["eric@parisbackline.com", "marko@parisbackline.com"] } },
  });

  console.log("Seeded users: eric & marko");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

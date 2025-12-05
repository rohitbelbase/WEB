// prisma/seed.cjs
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const DEFAULT_SKILLS = [
    "Email & Messaging",
    "Video Calls",
    "Online Safety",
    "Document Editing",
    "Spreadsheets",
    "Presentation Tools",
    "Smartphone Basics",
    "Tablet Basics",
    "Social Media",
    "Online Banking",
];

async function main() {
    console.log("Seeding skills...");

    for (const name of DEFAULT_SKILLS) {
        await prisma.skill.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    console.log("Done seeding skills.");
}

main()
    .catch((err) => {
        console.error("Seed error:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

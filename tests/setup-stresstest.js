const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Actual date when the tests have been done
process.env.CURRENT_DATE = new Date().toISOString().split('T')[0];

async function setup() {
  try {
    console.log('Förbereder för stresstest...');

    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    // Create a test user if it does not exist
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('Test123!', 10);

      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
        },
      });

      console.log('Testanvändare skapad: test@example.com');
    } else {
      console.log('Använder befintlig testanvändare: test@example.com');
    }

    console.log('Stresstest kan nu köras!');
  } catch (error) {
    console.error('Fel vid förberedelse av test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setup();

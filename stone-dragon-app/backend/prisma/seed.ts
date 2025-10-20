import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create schools
  const schools = await Promise.all([
    prisma.school.upsert({
      where: { id: 'school-1' },
      update: {},
      create: {
        id: 'school-1',
        name: 'Cape Town High School',
        address: '123 Main Street, Cape Town, 8001',
        contactEmail: 'admin@capetownhigh.edu.za',
        contactPhone: '+27 21 123 4567',
      },
    }),
    prisma.school.upsert({
      where: { id: 'school-2' },
      update: {},
      create: {
        id: 'school-2',
        name: 'Table Mountain Secondary',
        address: '456 Mountain View, Cape Town, 8001',
        contactEmail: 'info@tablemountain.edu.za',
        contactPhone: '+27 21 234 5678',
      },
    }),
    prisma.school.upsert({
      where: { id: 'school-3' },
      update: {},
      create: {
        id: 'school-3',
        name: 'V&A Waterfront Academy',
        address: '789 Harbour Road, Cape Town, 8001',
        contactEmail: 'contact@vaacademy.edu.za',
        contactPhone: '+27 21 345 6789',
      },
    }),
  ]);

  console.log('✅ Schools created:', schools.length);

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create users
  const users = await Promise.all([
    // Students
    prisma.user.upsert({
      where: { email: 'student1@example.com' },
      update: {},
      create: {
        email: 'student1@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Smith',
        role: 'STUDENT',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@example.com' },
      update: {},
      create: {
        email: 'student2@example.com',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'STUDENT',
        schoolId: 'school-2',
      },
    }),
    // Volunteers
    prisma.user.upsert({
      where: { email: 'volunteer1@example.com' },
      update: {},
      create: {
        email: 'volunteer1@example.com',
        password: hashedPassword,
        firstName: 'Mike',
        lastName: 'Wilson',
        role: 'VOLUNTEER',
        schoolId: 'school-1',
      },
    }),
    // Coordinators
    prisma.user.upsert({
      where: { email: 'coordinator1@example.com' },
      update: {},
      create: {
        email: 'coordinator1@example.com',
        password: hashedPassword,
        firstName: 'Emily',
        lastName: 'Davis',
        role: 'COORDINATOR',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'coordinator2@example.com' },
      update: {},
      create: {
        email: 'coordinator2@example.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Brown',
        role: 'COORDINATOR',
        schoolId: 'school-2',
      },
    }),
    // Admin
    prisma.user.upsert({
      where: { email: 'admin@stonedragon.org' },
      update: {},
      create: {
        email: 'admin@stonedragon.org',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
    }),
  ]);

  console.log('✅ Users created:', users.length);

  // Create badges
  const badges = await Promise.all([
    prisma.badge.upsert({
      where: { id: 'badge-1' },
      update: {},
      create: {
        id: 'badge-1',
        name: 'First Steps',
        description: 'Complete your first 5 volunteer hours',
        requiredHours: 5,
        iconUrl: 'https://example.com/badges/first-steps.png',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-2' },
      update: {},
      create: {
        id: 'badge-2',
        name: 'Community Helper',
        description: 'Reach 25 volunteer hours',
        requiredHours: 25,
        iconUrl: 'https://example.com/badges/community-helper.png',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-3' },
      update: {},
      create: {
        id: 'badge-3',
        name: 'Volunteer Champion',
        description: 'Achieve 50 volunteer hours',
        requiredHours: 50,
        iconUrl: 'https://example.com/badges/volunteer-champion.png',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-4' },
      update: {},
      create: {
        id: 'badge-4',
        name: 'Community Leader',
        description: 'Reach 100 volunteer hours',
        requiredHours: 100,
        iconUrl: 'https://example.com/badges/community-leader.png',
      },
    }),
    prisma.badge.upsert({
      where: { id: 'badge-5' },
      update: {},
      create: {
        id: 'badge-5',
        name: 'Volunteer Legend',
        description: 'Achieve 250 volunteer hours',
        requiredHours: 250,
        iconUrl: 'https://example.com/badges/volunteer-legend.png',
      },
    }),
  ]);

  console.log('✅ Badges created:', badges.length);

  // Create some volunteer logs
  const volunteerLogs = await Promise.all([
    prisma.volunteerLog.create({
      data: {
        hours: 3.5,
        description: 'Helped organize school library books and assisted students with finding resources.',
        date: new Date('2024-01-15'),
        status: 'approved',
        userId: users[0].id, // student1
        schoolId: 'school-1',
        reviewedBy: users[3].id, // coordinator1
        reviewedAt: new Date('2024-01-16'),
        coordinatorComment: 'Great work organizing the library!',
      },
    }),
    prisma.volunteerLog.create({
      data: {
        hours: 2.0,
        description: 'Assisted with school garden maintenance and planting new vegetables.',
        date: new Date('2024-01-20'),
        status: 'approved',
        userId: users[0].id, // student1
        schoolId: 'school-1',
        reviewedBy: users[3].id, // coordinator1
        reviewedAt: new Date('2024-01-21'),
        coordinatorComment: 'Excellent contribution to our school garden!',
      },
    }),
    prisma.volunteerLog.create({
      data: {
        hours: 4.0,
        description: 'Helped with community cleanup event at the local park.',
        date: new Date('2024-01-25'),
        status: 'pending',
        userId: users[1].id, // student2
        schoolId: 'school-2',
      },
    }),
    prisma.volunteerLog.create({
      data: {
        hours: 6.0,
        description: 'Volunteered at the local food bank, organizing donations and helping distribute food to families.',
        date: new Date('2024-01-28'),
        status: 'approved',
        userId: users[2].id, // volunteer1
        schoolId: 'school-1',
        reviewedBy: users[3].id, // coordinator1
        reviewedAt: new Date('2024-01-29'),
        coordinatorComment: 'Outstanding community service!',
      },
    }),
    prisma.volunteerLog.create({
      data: {
        hours: 2.5,
        description: 'Tutored younger students in mathematics after school.',
        date: new Date('2024-02-01'),
        status: 'pending',
        userId: users[1].id, // student2
        schoolId: 'school-2',
      },
    }),
  ]);

  console.log('✅ Volunteer logs created:', volunteerLogs.length);

  // Award some badges based on total hours
  const userBadges = [];

  // Student1 has 5.5 hours total - should get "First Steps" badge
  if (users[0]) {
    const firstStepsBadge = await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: users[0].id,
          badgeId: 'badge-1',
        },
      },
      update: {},
      create: {
        userId: users[0].id,
        badgeId: 'badge-1',
      },
    });
    userBadges.push(firstStepsBadge);
  }

  // Volunteer1 has 6 hours total - should get "First Steps" badge
  if (users[2]) {
    const firstStepsBadge = await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId: users[2].id,
          badgeId: 'badge-1',
        },
      },
      update: {},
      create: {
        userId: users[2].id,
        badgeId: 'badge-1',
      },
    });
    userBadges.push(firstStepsBadge);
  }

  console.log('✅ User badges created:', userBadges.length);

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Schools: ${schools.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Badges: ${badges.length}`);
  console.log(`- Volunteer Logs: ${volunteerLogs.length}`);
  console.log(`- User Badges: ${userBadges.length}`);
  
  console.log('\n🔑 Test Accounts:');
  console.log('Student: student1@example.com / password123');
  console.log('Volunteer: volunteer1@example.com / password123');
  console.log('Coordinator: coordinator1@example.com / password123');
  console.log('Admin: admin@stonedragon.org / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

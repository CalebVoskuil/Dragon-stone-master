import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Starting database seed...');

  // Create schools
  const schools = await Promise.all([
    prisma.school.upsert({
      where: { id: 'school-1' },
      update: {},
      create: {
        id: 'school-1',
        name: 'Rallim Secondary School Sunningdale',
        address: 'Sunningdale, Cape Town',
        contactEmail: 'admin@rallim.edu.za',
        contactPhone: '+27 21 123 4567',
      },
    }),
    prisma.school.upsert({
      where: { id: 'school-2' },
      update: {},
      create: {
        id: 'school-2',
        name: 'Elkanah House Preparatory Sunningdale',
        address: 'Sunningdale, Cape Town',
        contactEmail: 'info@elkanahhouse.edu.za',
        contactPhone: '+27 21 234 5678',
      },
    }),
  ]);

  console.log(' Schools created:', schools.length);

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create users
  const users = await Promise.all([
    // Students - Rallim Secondary School
    prisma.user.upsert({
      where: { email: 'alex.smith@student.ucta.ac.za' },
      update: {},
      create: {
        email: 'alex.smith@student.ucta.ac.za',
        password: hashedPassword,
        firstName: 'Alex',
        lastName: 'Smith',
        role: 'STUDENT',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.doe@rallim.edu.za' },
      update: {},
      create: {
        email: 'john.doe@rallim.edu.za',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'STUDENT',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'emma.wilson@rallim.edu.za' },
      update: {},
      create: {
        email: 'emma.wilson@rallim.edu.za',
        password: hashedPassword,
        firstName: 'Emma',
        lastName: 'Wilson',
        role: 'STUDENT',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'michael.brown@rallim.edu.za' },
      update: {},
      create: {
        email: 'michael.brown@rallim.edu.za',
        password: hashedPassword,
        firstName: 'Michael',
        lastName: 'Brown',
        role: 'STUDENT',
        schoolId: 'school-1',
      },
    }),
    // Students - Elkanah House
    prisma.user.upsert({
      where: { email: 'sarah.j@cthi.ac.za' },
      update: {},
      create: {
        email: 'sarah.j@cthi.ac.za',
        password: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'STUDENT',
        schoolId: 'school-2',
      },
    }),
    prisma.user.upsert({
      where: { email: 'oliver.jones@elkanahhouse.edu.za' },
      update: {},
      create: {
        email: 'oliver.jones@elkanahhouse.edu.za',
        password: hashedPassword,
        firstName: 'Oliver',
        lastName: 'Jones',
        role: 'STUDENT',
        schoolId: 'school-2',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sophia.davis@elkanahhouse.edu.za' },
      update: {},
      create: {
        email: 'sophia.davis@elkanahhouse.edu.za',
        password: hashedPassword,
        firstName: 'Sophia',
        lastName: 'Davis',
        role: 'STUDENT',
        schoolId: 'school-2',
      },
    }),
    prisma.user.upsert({
      where: { email: 'liam.miller@elkanahhouse.edu.za' },
      update: {},
      create: {
        email: 'liam.miller@elkanahhouse.edu.za',
        password: hashedPassword,
        firstName: 'Liam',
        lastName: 'Miller',
        role: 'STUDENT',
        schoolId: 'school-2',
      },
    }),
    // Coordinators - 1 per school
    prisma.user.upsert({
      where: { email: 'coordinator.rallim@example.com' },
      update: {},
      create: {
        email: 'coordinator.rallim@example.com',
        password: hashedPassword,
        firstName: 'Emily',
        lastName: 'Davis',
        role: 'COORDINATOR',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'coordinator.elkanah@example.com' },
      update: {},
      create: {
        email: 'coordinator.elkanah@example.com',
        password: hashedPassword,
        firstName: 'David',
        lastName: 'Brown',
        role: 'COORDINATOR',
        schoolId: 'school-2',
      },
    }),
    // Student Coordinators - 1 per school
    prisma.user.upsert({
      where: { email: 'studentcoord.rallim@example.com' },
      update: {},
      create: {
        email: 'studentcoord.rallim@example.com',
        password: hashedPassword,
        firstName: 'James',
        lastName: 'Taylor',
        role: 'STUDENT_COORDINATOR',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'studentcoord.elkanah@example.com' },
      update: {},
      create: {
        email: 'studentcoord.elkanah@example.com',
        password: hashedPassword,
        firstName: 'Grace',
        lastName: 'Martinez',
        role: 'STUDENT_COORDINATOR',
        schoolId: 'school-2',
      },
    }),
    // Admins - 2 admins (with school associations for organizational purposes)
    prisma.user.upsert({
      where: { email: 'admin@stonedragon.org' },
      update: {},
      create: {
        email: 'admin@stonedragon.org',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Primary',
        role: 'ADMIN',
        schoolId: 'school-1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin2@stonedragon.org' },
      update: {},
      create: {
        email: 'admin2@stonedragon.org',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Secondary',
        role: 'ADMIN',
        schoolId: 'school-2',
      },
    }),
  ]);

  console.log(' Users created:', users.length);

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

  console.log(' Badges created:', badges.length);

  // Create events
  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: 'event-1' },
      update: {},
      create: {
        id: 'event-1',
        title: 'Youth Mentorship Program - Rallim',
        description: 'Mentor young students with homework and life skills. Help them develop confidence and academic success.',
        date: new Date('2025-11-25'),
        time: '03:00 PM - 05:00 PM',
        location: 'Rallim Secondary School',
        duration: 2,
        maxVolunteers: 15,
        coordinatorId: users[10].id, // Rallim coordinator
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-2' },
      update: {},
      create: {
        id: 'event-2',
        title: 'Beach Cleanup Drive - Sunningdale',
        description: 'Join us for a morning beach cleanup to keep our shores beautiful.',
        date: new Date('2025-11-15'),
        time: '09:00 AM - 12:00 PM',
        location: 'Sunningdale Beach',
        duration: 3,
        maxVolunteers: 30,
        coordinatorId: users[10].id, // Rallim coordinator
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-3' },
      update: {},
      create: {
        id: 'event-3',
        title: 'Food Bank Distribution - Elkanah',
        description: 'Help distribute food parcels to families in need.',
        date: new Date('2025-12-20'),
        time: '10:00 AM - 02:00 PM',
        location: 'Elkanah House Community Center',
        duration: 4,
        maxVolunteers: 20,
        coordinatorId: users[11].id, // Elkanah coordinator
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-4' },
      update: {},
      create: {
        id: 'event-4',
        title: 'Library Organization - Elkanah',
        description: 'Help organize and catalog books in the school library.',
        date: new Date('2025-12-10'),
        time: '02:00 PM - 04:00 PM',
        location: 'Elkanah House Library',
        duration: 2,
        maxVolunteers: 10,
        coordinatorId: users[11].id, // Elkanah coordinator
      },
    }),
  ]);

  console.log(' Events created:', events.length);

  // Assign student coordinators to events
  await Promise.all([
    prisma.eventCoordinator.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-1',
          userId: users[12].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-1',
        userId: users[12].id, // Rallim student coordinator
      },
    }),
    prisma.eventCoordinator.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-3',
          userId: users[13].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-3',
        userId: users[13].id, // Elkanah student coordinator
      },
    }),
  ]);

  // Register students for events
  await Promise.all([
    // Rallim students for Rallim events
    prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-1',
          userId: users[0].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-1',
        userId: users[0].id, // Alex -> event-1
      },
    }),
    prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-2',
          userId: users[0].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-2',
        userId: users[0].id, // Alex -> event-2
      },
    }),
    prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-1',
          userId: users[1].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-1',
        userId: users[1].id, // John -> event-1
      },
    }),
    // Elkanah students for Elkanah events
    prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-3',
          userId: users[4].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-3',
        userId: users[4].id, // Sarah -> event-3
      },
    }),
    prisma.eventRegistration.upsert({
      where: {
        eventId_userId: {
          eventId: 'event-4',
          userId: users[5].id,
        },
      },
      update: {},
      create: {
        eventId: 'event-4',
        userId: users[5].id, // Oliver -> event-4
      },
    }),
  ]);

  console.log(' Event registrations created');

  // Create some volunteer logs with different claim types
  const volunteerLogs = await Promise.all([
    // RALLIM SCHOOL CLAIMS (school-1)
    // Event claim - pending (for Rallim coordinator to review)
    prisma.volunteerLog.upsert({
      where: { id: 'log-1' },
      update: {},
      create: {
        id: 'log-1',
        hours: 2.0,
        description: 'Attended Youth Mentorship Program and helped students with homework.',
        date: new Date('2025-11-25'),
        claimType: 'event',
        eventId: 'event-1',
        status: 'pending',
        userId: users[0].id, // Alex (Rallim)
        schoolId: 'school-1',
      },
    }),
    // Event claim - pending
    prisma.volunteerLog.upsert({
      where: { id: 'log-2' },
      update: {},
      create: {
        id: 'log-2',
        hours: 3.0,
        description: 'Participated in Beach Cleanup Drive.',
        date: new Date('2025-11-15'),
        claimType: 'event',
        eventId: 'event-2',
        status: 'pending',
        userId: users[1].id, // John (Rallim)
        schoolId: 'school-1',
      },
    }),
    // Volunteer claim - approved (admins can see this)
    prisma.volunteerLog.upsert({
      where: { id: 'log-3' },
      update: {},
      create: {
        id: 'log-3',
        hours: 3.5,
        description: 'Helped organize school library books and assisted students with finding resources.',
        date: new Date('2025-09-15'),
        claimType: 'volunteer',
        status: 'approved',
        userId: users[0].id, // Alex (Rallim)
        schoolId: 'school-1',
        reviewedBy: users[10].id, // Rallim coordinator
        reviewedAt: new Date('2025-09-16'),
        coordinatorComment: 'Great work organizing the library!',
      },
    }),
    // Donation claim - rejected (admins can see this)
    prisma.volunteerLog.upsert({
      where: { id: 'log-4' },
      update: {},
      create: {
        id: 'log-4',
        hours: 0,
        description: 'Donated items to charity.',
        date: new Date('2025-09-20'),
        claimType: 'donation',
        donationItems: 2,
        status: 'rejected',
        userId: users[2].id, // Emma (Rallim)
        schoolId: 'school-1',
        reviewedBy: users[10].id, // Rallim coordinator
        reviewedAt: new Date('2025-09-21'),
        coordinatorComment: 'Need more documentation of donation.',
      },
    }),
    // Other claim - pending
    prisma.volunteerLog.upsert({
      where: { id: 'log-5' },
      update: {},
      create: {
        id: 'log-5',
        hours: 0,
        description: 'Organized a fundraising event for local animal shelter. Need coordinator to determine hours.',
        date: new Date('2025-10-18'),
        claimType: 'other',
        status: 'pending',
        userId: users[3].id, // Michael (Rallim)
        schoolId: 'school-1',
      },
    }),
    // ELKANAH SCHOOL CLAIMS (school-2)
    // Event claim - pending (for Elkanah coordinator to review)
    prisma.volunteerLog.upsert({
      where: { id: 'log-6' },
      update: {},
      create: {
        id: 'log-6',
        hours: 4.0,
        description: 'Attended Food Bank Distribution event.',
        date: new Date('2025-12-20'),
        claimType: 'event',
        eventId: 'event-3',
        status: 'pending',
        userId: users[4].id, // Sarah (Elkanah)
        schoolId: 'school-2',
      },
    }),
    // Donation claim - pending
    prisma.volunteerLog.upsert({
      where: { id: 'log-7' },
      update: {},
      create: {
        id: 'log-7',
        hours: 5.0,
        description: 'Donated 5 bags of clothes to local charity.',
        date: new Date('2025-10-20'),
        claimType: 'donation',
        donationItems: 5,
        status: 'pending',
        userId: users[5].id, // Oliver (Elkanah)
        schoolId: 'school-2',
      },
    }),
    // Volunteer claim - approved (admins can see this)
    prisma.volunteerLog.upsert({
      where: { id: 'log-8' },
      update: {},
      create: {
        id: 'log-8',
        hours: 4.0,
        description: 'Helped with community cleanup event at the local park.',
        date: new Date('2025-10-15'),
        claimType: 'volunteer',
        status: 'approved',
        userId: users[6].id, // Sophia (Elkanah)
        schoolId: 'school-2',
        reviewedBy: users[11].id, // Elkanah coordinator
        reviewedAt: new Date('2025-10-16'),
        coordinatorComment: 'Great community initiative!',
      },
    }),
    // Volunteer claim - approved (admins can see this)
    prisma.volunteerLog.upsert({
      where: { id: 'log-9' },
      update: {},
      create: {
        id: 'log-9',
        hours: 6.0,
        description: 'Tutored younger students in mathematics.',
        date: new Date('2025-10-10'),
        claimType: 'volunteer',
        status: 'approved',
        userId: users[7].id, // Liam (Elkanah)
        schoolId: 'school-2',
        reviewedBy: users[11].id, // Elkanah coordinator
        reviewedAt: new Date('2025-10-11'),
        coordinatorComment: 'Excellent tutoring work!',
      },
    }),
    // Other claim - rejected (admins can see this)
    prisma.volunteerLog.upsert({
      where: { id: 'log-10' },
      update: {},
      create: {
        id: 'log-10',
        hours: 0,
        description: 'Unclear volunteer activity description.',
        date: new Date('2025-10-05'),
        claimType: 'other',
        status: 'rejected',
        userId: users[4].id, // Sarah (Elkanah)
        schoolId: 'school-2',
        reviewedBy: users[11].id, // Elkanah coordinator
        reviewedAt: new Date('2025-10-06'),
        coordinatorComment: 'Please provide more details about the activity.',
      },
    }),
  ]);

  console.log(' Volunteer logs created:', volunteerLogs.length);

  // Award some badges based on total hours
  const userBadges: any[] = [];

  // Alex (Student at Rallim) has 5.5 hours total - should get "First Steps" badge
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

  console.log(' User badges created:', userBadges.length);

  console.log(' Database seeding completed successfully!');
  console.log('\n Summary:');
  console.log(`- Schools: ${schools.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Events: ${events.length}`);
  console.log(`- Badges: ${badges.length}`);
  console.log(`- Volunteer Logs: ${volunteerLogs.length}`);
  console.log(`- User Badges: ${userBadges.length}`);
  
  console.log('\n Test Accounts (all passwords: password123):');
  console.log('\n RALLIM SECONDARY SCHOOL:');
  console.log('  Students:');
  console.log('    - alex.smith@student.ucta.ac.za');
  console.log('    - john.doe@rallim.edu.za');
  console.log('    - emma.wilson@rallim.edu.za');
  console.log('    - michael.brown@rallim.edu.za');
  console.log('  Coordinator: coordinator.rallim@example.com');
  console.log('  Student Coordinator: studentcoord.rallim@example.com');
  
  console.log('\n ELKANAH HOUSE PREPARATORY:');
  console.log('  Students:');
  console.log('    - sarah.j@cthi.ac.za');
  console.log('    - oliver.jones@elkanahhouse.edu.za');
  console.log('    - sophia.davis@elkanahhouse.edu.za');
  console.log('    - liam.miller@elkanahhouse.edu.za');
  console.log('  Coordinator: coordinator.elkanah@example.com');
  console.log('  Student Coordinator: studentcoord.elkanah@example.com');
  
  console.log('\n ADMINS (can view all schools):');
  console.log('  - admin@stonedragon.org');
  console.log('  - admin2@stonedragon.org');
}

main()
  .catch((e) => {
    console.error(' Error during seeding:', e);
    
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

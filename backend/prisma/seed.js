const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Facilities
  const facilities = await Promise.all([
    prisma.facility.create({ data: { name: 'AC' } }),
    prisma.facility.create({ data: { name: 'WiFi' } }),
    prisma.facility.create({ data: { name: 'Kamar Mandi Dalam' } }),
    prisma.facility.create({ data: { name: 'Kasur' } }),
    prisma.facility.create({ data: { name: 'Lemari' } }),
    prisma.facility.create({ data: { name: 'Meja Belajar' } }),
  ]);
  const facilityIds = facilities.map(f => ({ id: f.id }));

  // 2. Create Users
  const admin = await prisma.user.create({
    data: { role: 'Admin', fullname: 'Admin Utama', email: 'admin@kost.com', phone: '08111111111' }
  });
  const owner = await prisma.user.create({
    data: { role: 'Admin', fullname: 'Bapak Kost', email: 'owner@kost.com', phone: '08222222222' }
  });
  const tenantUser = await prisma.user.create({
    data: { role: 'Tenant', fullname: 'Budi Santoso', email: 'budi@gmail.com', phone: '08333333333' }
  });
  const guestUser = await prisma.user.create({
    data: { role: 'Guest', fullname: 'Calon Penyewa', email: 'calon@gmail.com', phone: '08444444444' }
  });

  // 3. Create Rooms
  const room1 = await prisma.room.create({
    data: {
      room_number: '101',
      price: 1500000,
      description: 'Kamar luas di lantai 1 dengan pencahayaan alami yang baik.',
      status: 'Terisi',
      image: '/img/kamar1.jpg',
      facilities: { connect: facilityIds.slice(0, 5) }
    }
  });
  const room2 = await prisma.room.create({
    data: {
      room_number: '102',
      price: 1500000,
      description: 'Kamar strategis dekat tangga utama.',
      status: 'Kosong',
      image: '/img/kamar2.jpg',
      facilities: { connect: facilityIds.slice(0, 5) }
    }
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const tenantPassword = await bcrypt.hash('password', 10);

  // 1. Create Facilities (using upsert requires a unique field. We'll use findFirst/create since name is not unique)
  const facilitiesData = ['AC', 'WiFi', 'Kamar Mandi Dalam', 'Kasur', 'Lemari', 'Meja Belajar'];
  const facilities = await Promise.all(
    facilitiesData.map(async (name) => {
      let facility = await prisma.facility.findFirst({ where: { name } });
      if (!facility) {
        facility = await prisma.facility.create({ data: { name } });
      }
      return facility;
    })
  );
  const facilityIds = facilities.map(f => ({ id: f.id }));

  // 2. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kost.com' },
    update: { password: adminPassword },
    create: { role: 'Admin', fullname: 'Admin Utama', email: 'admin@kost.com', phone: '08111111111', password: adminPassword }
  });
  const owner = await prisma.user.upsert({
    where: { email: 'owner@kost.com' },
    update: { password: adminPassword },
    create: { role: 'Admin', fullname: 'Bapak Kost', email: 'owner@kost.com', phone: '08222222222', password: adminPassword }
  });
  const tenantUser = await prisma.user.upsert({
    where: { email: 'budi@gmail.com' },
    update: { password: tenantPassword },
    create: { role: 'Tenant', fullname: 'Budi Santoso', email: 'budi@gmail.com', phone: '08333333333', password: tenantPassword }
  });

  // 3. Create Rooms
  const room1 = await prisma.room.upsert({
    where: { room_number: '101' },
    update: {},
    create: {
      room_number: '101',
      price: 1500000,
      description: 'Kamar luas di lantai 1 dengan pencahayaan alami yang baik.',
      status: 'Terisi',
      image: '/img/kamar1.jpg',
      facilities: { connect: facilityIds.slice(0, 5) }
    }
  });
  const room2 = await prisma.room.upsert({
    where: { room_number: '102' },
    update: {},
    create: {
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

import sequelize from '../config/database';
import { User, Residence, Amenity, Activity, Report, Payment } from '../models';
import { UserRole, ResidenceStatus, ReportStatus, PaymentStatus, PaymentType } from '../types';

const seed = async () => {
  try {
    console.log('Starting database seeding...');

    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Clear existing data (optional - be careful in production!)
    if (process.env.NODE_ENV === 'development') {
      await Payment.destroy({ where: {}, force: true });
      await Report.destroy({ where: {}, force: true });
      await Activity.destroy({ where: {}, force: true });
      await Amenity.destroy({ where: {}, force: true });
      await User.destroy({ where: {}, force: true });
      await Residence.destroy({ where: {}, force: true });
      console.log('✓ Existing data cleared');
    }

    // Create residences
    const residences = await Residence.bulkCreate([
      {
        name: 'Apartamento 101',
        address: 'Av. Principal 123, Edificio Torre A',
        floor: 1,
        apartmentNumber: '101',
        squareMeters: 85.5,
        bedrooms: 2,
        bathrooms: 2,
        status: ResidenceStatus.AVAILABLE,
        monthlyRent: 1200.00,
        description: 'Hermoso apartamento con vista a la ciudad',
        imageUrl: 'https://example.com/apt101.jpg'
      },
      {
        name: 'Apartamento 202',
        address: 'Av. Principal 123, Edificio Torre A',
        floor: 2,
        apartmentNumber: '202',
        squareMeters: 95.0,
        bedrooms: 3,
        bathrooms: 2,
        status: ResidenceStatus.OCCUPIED,
        monthlyRent: 1500.00,
        description: 'Amplio apartamento con balcón',
        imageUrl: 'https://example.com/apt202.jpg'
      },
      {
        name: 'Apartamento 303',
        address: 'Av. Principal 123, Edificio Torre A',
        floor: 3,
        apartmentNumber: '303',
        squareMeters: 120.0,
        bedrooms: 3,
        bathrooms: 3,
        status: ResidenceStatus.OCCUPIED,
        monthlyRent: 1800.00,
        description: 'Penthouse con terraza privada',
        imageUrl: 'https://example.com/apt303.jpg'
      }
    ]);
    console.log('✓ Residences created');

    // Create users
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'Sistema',
      email: 'admin@residence.com',
      password: 'admin123',
      phone: '+1234567890',
      role: UserRole.ADMIN,
      isActive: true
    });

    const resident1 = await User.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@example.com',
      password: 'resident123',
      phone: '+1234567891',
      role: UserRole.RESIDENT,
      residenceId: residences[1].id,
      isActive: true
    });

    const resident2 = await User.create({
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@example.com',
      password: 'resident123',
      phone: '+1234567892',
      role: UserRole.RESIDENT,
      residenceId: residences[2].id,
      isActive: true
    });

    const resident3 = await User.create({
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@example.com',
      password: 'resident123',
      phone: '+1234567893',
      role: UserRole.RESIDENT,
      isActive: true
    });
    console.log('✓ Users created');

    // Create amenities
    await Amenity.bulkCreate([
      {
        name: 'Piscina',
        description: 'Piscina olímpica climatizada',
        location: 'Área común - Piso 1',
        capacity: 30,
        isAvailable: true,
        openingTime: '06:00:00',
        closingTime: '22:00:00',
        imageUrl: 'https://example.com/pool.jpg'
      },
      {
        name: 'Gimnasio',
        description: 'Gimnasio completamente equipado',
        location: 'Área común - Piso 2',
        capacity: 20,
        isAvailable: true,
        openingTime: '05:00:00',
        closingTime: '23:00:00',
        imageUrl: 'https://example.com/gym.jpg'
      },
      {
        name: 'Salón de Eventos',
        description: 'Salón para reuniones y eventos',
        location: 'Área común - Piso 3',
        capacity: 50,
        isAvailable: true,
        openingTime: '08:00:00',
        closingTime: '23:00:00',
        imageUrl: 'https://example.com/events.jpg'
      },
      {
        name: 'Parque Infantil',
        description: 'Área de juegos para niños',
        location: 'Jardín exterior',
        capacity: 15,
        isAvailable: true,
        openingTime: '07:00:00',
        closingTime: '20:00:00',
        imageUrl: 'https://example.com/playground.jpg'
      }
    ]);
    console.log('✓ Amenities created');

    // Create activities
    await Activity.bulkCreate([
      {
        title: 'Clase de Yoga',
        description: 'Clase de yoga para todos los niveles',
        date: new Date('2025-12-10'),
        startTime: '07:00:00',
        endTime: '08:00:00',
        location: 'Salón de Eventos',
        capacity: 20,
        availableSpots: 15,
        isActive: true,
        imageUrl: 'https://example.com/yoga.jpg'
      },
      {
        title: 'Noche de Película',
        description: 'Proyección de película para toda la familia',
        date: new Date('2025-12-12'),
        startTime: '19:00:00',
        endTime: '21:30:00',
        location: 'Salón de Eventos',
        capacity: 50,
        availableSpots: 40,
        isActive: true,
        imageUrl: 'https://example.com/movie.jpg'
      },
      {
        title: 'Torneo de Natación',
        description: 'Competencia amistosa de natación',
        date: new Date('2025-12-15'),
        startTime: '10:00:00',
        endTime: '13:00:00',
        location: 'Piscina',
        capacity: 30,
        availableSpots: 25,
        isActive: true,
        imageUrl: 'https://example.com/swimming.jpg'
      }
    ]);
    console.log('✓ Activities created');

    // Create reports
    await Report.bulkCreate([
      {
        userId: resident1.id,
        residenceId: residences[1].id,
        title: 'Problema con calefacción',
        description: 'La calefacción no funciona correctamente en el apartamento',
        category: 'Mantenimiento',
        status: ReportStatus.PENDING,
        priority: 'HIGH'
      },
      {
        userId: resident2.id,
        residenceId: residences[2].id,
        title: 'Ruido excesivo',
        description: 'Mucho ruido en las noches desde el piso superior',
        category: 'Queja',
        status: ReportStatus.IN_PROGRESS,
        priority: 'MEDIUM'
      },
      {
        userId: resident1.id,
        title: 'Luz fundida en pasillo',
        description: 'La luz del pasillo del segundo piso está fundida',
        category: 'Mantenimiento',
        status: ReportStatus.RESOLVED,
        priority: 'LOW',
        responseMessage: 'Se ha reemplazado la bombilla'
      }
    ]);
    console.log('✓ Reports created');

    // Create payments
    await Payment.bulkCreate([
      {
        userId: resident1.id,
        residenceId: residences[1].id,
        amount: 1500.00,
        type: PaymentType.RENT,
        status: PaymentStatus.PAID,
        dueDate: new Date('2025-11-01'),
        paymentDate: new Date('2025-10-28'),
        description: 'Renta de noviembre 2025',
        transactionId: 'TXN-2025-11-001'
      },
      {
        userId: resident2.id,
        residenceId: residences[2].id,
        amount: 1800.00,
        type: PaymentType.RENT,
        status: PaymentStatus.PAID,
        dueDate: new Date('2025-11-01'),
        paymentDate: new Date('2025-11-01'),
        description: 'Renta de noviembre 2025',
        transactionId: 'TXN-2025-11-002'
      },
      {
        userId: resident1.id,
        residenceId: residences[1].id,
        amount: 1500.00,
        type: PaymentType.RENT,
        status: PaymentStatus.PENDING,
        dueDate: new Date('2025-12-01'),
        description: 'Renta de diciembre 2025'
      },
      {
        userId: resident2.id,
        residenceId: residences[2].id,
        amount: 1800.00,
        type: PaymentType.RENT,
        status: PaymentStatus.PENDING,
        dueDate: new Date('2025-12-01'),
        description: 'Renta de diciembre 2025'
      },
      {
        userId: resident1.id,
        residenceId: residences[1].id,
        amount: 200.00,
        type: PaymentType.MAINTENANCE,
        status: PaymentStatus.PENDING,
        dueDate: new Date('2025-12-05'),
        description: 'Cuota de mantenimiento'
      }
    ]);
    console.log('✓ Payments created');

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@residence.com / admin123');
    console.log('Resident 1: juan.perez@example.com / resident123');
    console.log('Resident 2: maria.garcia@example.com / resident123');
    console.log('Resident 3: carlos.lopez@example.com / resident123');

    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
};

seed();

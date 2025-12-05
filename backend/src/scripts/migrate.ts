import sequelize from '../config/database';
import '../models';

const migrate = async () => {
  try {
    console.log('Starting database migration...');

    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync all models with the database
    await sequelize.sync({ force: false, alter: true });
    console.log('✓ Database tables created/updated successfully');

    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
};

migrate();

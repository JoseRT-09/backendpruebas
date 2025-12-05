import User from './User';
import Residence from './Residence';
import Amenity from './Amenity';
import Activity from './Activity';
import Report from './Report';
import Payment from './Payment';

// Definir relaciones entre modelos

// User - Residence (muchos a uno)
User.belongsTo(Residence, { foreignKey: 'residenceId', as: 'residence' });
Residence.hasMany(User, { foreignKey: 'residenceId', as: 'residents' });

// Report - User (muchos a uno)
Report.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Report, { foreignKey: 'userId', as: 'reports' });

// Report - Residence (muchos a uno)
Report.belongsTo(Residence, { foreignKey: 'residenceId', as: 'residence' });
Residence.hasMany(Report, { foreignKey: 'residenceId', as: 'reports' });

// Payment - User (muchos a uno)
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });

// Payment - Residence (muchos a uno)
Payment.belongsTo(Residence, { foreignKey: 'residenceId', as: 'residence' });
Residence.hasMany(Payment, { foreignKey: 'residenceId', as: 'payments' });

export {
  User,
  Residence,
  Amenity,
  Activity,
  Report,
  Payment
};

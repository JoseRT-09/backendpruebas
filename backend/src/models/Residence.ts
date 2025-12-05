import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ResidenceStatus } from '../types';

interface ResidenceAttributes {
  id: number;
  name: string;
  address: string;
  floor: number;
  apartmentNumber: string;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  status: ResidenceStatus;
  monthlyRent: number;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ResidenceCreationAttributes extends Optional<ResidenceAttributes, 'id' | 'description' | 'imageUrl' | 'createdAt' | 'updatedAt'> {}

class Residence extends Model<ResidenceAttributes, ResidenceCreationAttributes> implements ResidenceAttributes {
  public id!: number;
  public name!: string;
  public address!: string;
  public floor!: number;
  public apartmentNumber!: string;
  public squareMeters!: number;
  public bedrooms!: number;
  public bathrooms!: number;
  public status!: ResidenceStatus;
  public monthlyRent!: number;
  public description?: string;
  public imageUrl?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Residence.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    apartmentNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'apartment_number'
    },
    squareMeters: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'square_meters'
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ResidenceStatus)),
      allowNull: false,
      defaultValue: ResidenceStatus.AVAILABLE
    },
    monthlyRent: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'monthly_rent'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url'
    }
  },
  {
    sequelize,
    tableName: 'residences',
    underscored: true,
    timestamps: true
  }
);

export default Residence;

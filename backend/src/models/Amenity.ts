import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AmenityAttributes {
  id: number;
  name: string;
  description?: string;
  location: string;
  capacity?: number;
  isAvailable: boolean;
  openingTime?: string;
  closingTime?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AmenityCreationAttributes extends Optional<AmenityAttributes, 'id' | 'description' | 'capacity' | 'openingTime' | 'closingTime' | 'imageUrl' | 'isAvailable' | 'createdAt' | 'updatedAt'> {}

class Amenity extends Model<AmenityAttributes, AmenityCreationAttributes> implements AmenityAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public location!: string;
  public capacity?: number;
  public isAvailable!: boolean;
  public openingTime?: string;
  public closingTime?: string;
  public imageUrl?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Amenity.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_available'
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'opening_time'
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'closing_time'
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url'
    }
  },
  {
    sequelize,
    tableName: 'amenities',
    underscored: true,
    timestamps: true
  }
);

export default Amenity;

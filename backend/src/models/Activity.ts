import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ActivityAttributes {
  id: number;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  capacity?: number;
  availableSpots?: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ActivityCreationAttributes extends Optional<ActivityAttributes, 'id' | 'description' | 'capacity' | 'availableSpots' | 'imageUrl' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class Activity extends Model<ActivityAttributes, ActivityCreationAttributes> implements ActivityAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public date!: Date;
  public startTime!: string;
  public endTime!: string;
  public location!: string;
  public capacity?: number;
  public availableSpots?: number;
  public isActive!: boolean;
  public imageUrl?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'end_time'
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    availableSpots: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'available_spots'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active'
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'image_url'
    }
  },
  {
    sequelize,
    tableName: 'activities',
    underscored: true,
    timestamps: true
  }
);

export default Activity;

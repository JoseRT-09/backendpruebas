import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { ReportStatus } from '../types';

interface ReportAttributes {
  id: number;
  userId: number;
  residenceId?: number;
  title: string;
  description: string;
  category: string;
  status: ReportStatus;
  priority: string;
  responseMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'residenceId' | 'responseMessage' | 'status' | 'createdAt' | 'updatedAt'> {}

class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
  public id!: number;
  public userId!: number;
  public residenceId?: number;
  public title!: string;
  public description!: string;
  public category!: string;
  public status!: ReportStatus;
  public priority!: string;
  public responseMessage?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    residenceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'residence_id',
      references: {
        model: 'residences',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ReportStatus)),
      allowNull: false,
      defaultValue: ReportStatus.PENDING
    },
    priority: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'MEDIUM'
    },
    responseMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'response_message'
    }
  },
  {
    sequelize,
    tableName: 'reports',
    underscored: true,
    timestamps: true
  }
);

export default Report;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { PaymentStatus, PaymentType } from '../types';

interface PaymentAttributes {
  id: number;
  userId: number;
  residenceId: number;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: Date;
  paymentDate?: Date;
  description?: string;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'paymentDate' | 'description' | 'transactionId' | 'status' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public userId!: number;
  public residenceId!: number;
  public amount!: number;
  public type!: PaymentType;
  public status!: PaymentStatus;
  public dueDate!: Date;
  public paymentDate?: Date;
  public description?: string;
  public transactionId?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
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
      allowNull: false,
      field: 'residence_id',
      references: {
        model: 'residences',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(PaymentType)),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(...Object.values(PaymentStatus)),
      allowNull: false,
      defaultValue: PaymentStatus.PENDING
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'due_date'
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'payment_date'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'transaction_id'
    }
  },
  {
    sequelize,
    tableName: 'payments',
    underscored: true,
    timestamps: true
  }
);

export default Payment;

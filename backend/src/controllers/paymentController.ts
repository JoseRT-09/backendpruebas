import { Response, NextFunction } from 'express';
import { Payment, User, Residence } from '../models';
import { AuthRequest, UserRole } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class PaymentController {
  // Get all payments (Admin sees all, Resident sees only their own)
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const whereClause = req.user?.role === UserRole.RESIDENT
        ? { userId: req.user.id }
        : {};

      const payments = await Payment.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ],
        order: [['dueDate', 'DESC']]
      });
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  // Get payment by ID
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await Payment.findByPk(req.params.id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ]
      });

      if (!payment) {
        throw new ApiError(404, 'Payment not found');
      }

      // Residents can only see their own payments
      if (req.user?.role === UserRole.RESIDENT && payment.userId !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  // Create payment (Admin only)
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await Payment.create(req.body);
      const createdPayment = await Payment.findByPk(payment.id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ]
      });
      res.status(201).json(createdPayment);
    } catch (error) {
      next(error);
    }
  }

  // Update payment
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        throw new ApiError(404, 'Payment not found');
      }

      // Residents can only mark their own payments as paid
      if (req.user?.role === UserRole.RESIDENT) {
        if (payment.userId !== req.user.id) {
          throw new ApiError(403, 'Access denied');
        }
        // Residents can only update status to PAID and add transaction ID
        const { status, transactionId } = req.body;
        if (status === 'PAID') {
          await payment.update({
            status,
            transactionId,
            paymentDate: new Date()
          });
        } else {
          throw new ApiError(403, 'You can only mark payments as paid');
        }
      } else {
        // Admins can update all fields
        await payment.update(req.body);
      }

      const updatedPayment = await Payment.findByPk(payment.id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ]
      });

      res.json(updatedPayment);
    } catch (error) {
      next(error);
    }
  }

  // Delete payment (Admin only)
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await Payment.findByPk(req.params.id);

      if (!payment) {
        throw new ApiError(404, 'Payment not found');
      }

      await payment.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Get pending payments for current user
  static async getPending(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payments = await Payment.findAll({
        where: {
          userId: req.user?.id,
          status: 'PENDING'
        },
        include: [{ model: Residence, as: 'residence' }],
        order: [['dueDate', 'ASC']]
      });
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }
}

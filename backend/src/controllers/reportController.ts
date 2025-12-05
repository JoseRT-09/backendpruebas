import { Response, NextFunction } from 'express';
import { Report, User, Residence } from '../models';
import { AuthRequest, UserRole } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class ReportController {
  // Get all reports (Admin sees all, Resident sees only their own)
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const whereClause = req.user?.role === UserRole.RESIDENT
        ? { userId: req.user.id }
        : {};

      const reports = await Report.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(reports);
    } catch (error) {
      next(error);
    }
  }

  // Get report by ID
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await Report.findByPk(req.params.id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ]
      });

      if (!report) {
        throw new ApiError(404, 'Report not found');
      }

      // Residents can only see their own reports
      if (req.user?.role === UserRole.RESIDENT && report.userId !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      res.json(report);
    } catch (error) {
      next(error);
    }
  }

  // Create report
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reportData = {
        ...req.body,
        userId: req.user?.id
      };

      const report = await Report.create(reportData);
      const createdReport = await Report.findByPk(report.id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ]
      });
      res.status(201).json(createdReport);
    } catch (error) {
      next(error);
    }
  }

  // Update report
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await Report.findByPk(req.params.id);

      if (!report) {
        throw new ApiError(404, 'Report not found');
      }

      // Residents can only update their own reports and only certain fields
      if (req.user?.role === UserRole.RESIDENT) {
        if (report.userId !== req.user.id) {
          throw new ApiError(403, 'Access denied');
        }
        // Residents can only update description
        const { description } = req.body;
        await report.update({ description });
      } else {
        // Admins can update all fields
        await report.update(req.body);
      }

      const updatedReport = await Report.findByPk(report.id, {
        include: [
          { model: User, as: 'user', attributes: { exclude: ['password'] } },
          { model: Residence, as: 'residence' }
        ]
      });

      res.json(updatedReport);
    } catch (error) {
      next(error);
    }
  }

  // Delete report
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const report = await Report.findByPk(req.params.id);

      if (!report) {
        throw new ApiError(404, 'Report not found');
      }

      // Residents can only delete their own pending reports
      if (req.user?.role === UserRole.RESIDENT) {
        if (report.userId !== req.user.id || report.status !== 'PENDING') {
          throw new ApiError(403, 'Access denied');
        }
      }

      await report.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

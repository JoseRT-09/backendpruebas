import { Response, NextFunction } from 'express';
import { Activity } from '../models';
import { AuthRequest } from '../types';
import { ApiError } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export class ActivityController {
  // Get all activities
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activities = await Activity.findAll({
        order: [['date', 'DESC'], ['startTime', 'DESC']]
      });
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }

  // Get activity by ID
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activity = await Activity.findByPk(req.params.id);

      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }

      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  // Create activity (Admin only)
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activity = await Activity.create(req.body);
      res.status(201).json(activity);
    } catch (error) {
      next(error);
    }
  }

  // Update activity (Admin only)
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activity = await Activity.findByPk(req.params.id);

      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }

      await activity.update(req.body);
      res.json(activity);
    } catch (error) {
      next(error);
    }
  }

  // Delete activity (Admin only)
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const activity = await Activity.findByPk(req.params.id);

      if (!activity) {
        throw new ApiError(404, 'Activity not found');
      }

      await activity.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Get upcoming activities
  static async getUpcoming(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const today = new Date();
      const activities = await Activity.findAll({
        where: {
          date: {
            [Op.gte]: today
          },
          isActive: true
        },
        order: [['date', 'ASC'], ['startTime', 'ASC']]
      });
      res.json(activities);
    } catch (error) {
      next(error);
    }
  }
}

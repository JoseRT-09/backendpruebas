import { Response, NextFunction } from 'express';
import { Residence, User } from '../models';
import { AuthRequest } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class ResidenceController {
  // Get all residences
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const residences = await Residence.findAll({
        include: [{ model: User, as: 'residents', attributes: { exclude: ['password'] } }]
      });
      res.json(residences);
    } catch (error) {
      next(error);
    }
  }

  // Get residence by ID
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const residence = await Residence.findByPk(req.params.id, {
        include: [{ model: User, as: 'residents', attributes: { exclude: ['password'] } }]
      });

      if (!residence) {
        throw new ApiError(404, 'Residence not found');
      }

      res.json(residence);
    } catch (error) {
      next(error);
    }
  }

  // Create residence (Admin only)
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const residence = await Residence.create(req.body);
      res.status(201).json(residence);
    } catch (error) {
      next(error);
    }
  }

  // Update residence (Admin only)
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const residence = await Residence.findByPk(req.params.id);

      if (!residence) {
        throw new ApiError(404, 'Residence not found');
      }

      await residence.update(req.body);
      res.json(residence);
    } catch (error) {
      next(error);
    }
  }

  // Delete residence (Admin only)
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const residence = await Residence.findByPk(req.params.id);

      if (!residence) {
        throw new ApiError(404, 'Residence not found');
      }

      await residence.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Get available residences
  static async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const residences = await Residence.findAll({
        where: { status: 'AVAILABLE' }
      });
      res.json(residences);
    } catch (error) {
      next(error);
    }
  }
}

import { Response, NextFunction } from 'express';
import { Amenity } from '../models';
import { AuthRequest } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class AmenityController {
  // Get all amenities
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const amenities = await Amenity.findAll();
      res.json(amenities);
    } catch (error) {
      next(error);
    }
  }

  // Get amenity by ID
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const amenity = await Amenity.findByPk(req.params.id);

      if (!amenity) {
        throw new ApiError(404, 'Amenity not found');
      }

      res.json(amenity);
    } catch (error) {
      next(error);
    }
  }

  // Create amenity (Admin only)
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const amenity = await Amenity.create(req.body);
      res.status(201).json(amenity);
    } catch (error) {
      next(error);
    }
  }

  // Update amenity (Admin only)
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const amenity = await Amenity.findByPk(req.params.id);

      if (!amenity) {
        throw new ApiError(404, 'Amenity not found');
      }

      await amenity.update(req.body);
      res.json(amenity);
    } catch (error) {
      next(error);
    }
  }

  // Delete amenity (Admin only)
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const amenity = await Amenity.findByPk(req.params.id);

      if (!amenity) {
        throw new ApiError(404, 'Amenity not found');
      }

      await amenity.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Get available amenities
  static async getAvailable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const amenities = await Amenity.findAll({
        where: { isAvailable: true }
      });
      res.json(amenities);
    } catch (error) {
      next(error);
    }
  }
}

import { Response, NextFunction } from 'express';
import { User, Residence } from '../models';
import { AuthRequest } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class UserController {
  // Get all users (Admin only)
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{ model: Residence, as: 'residence' }]
      });
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Residence, as: 'residence' }]
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Create user (Admin only)
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.create(req.body);
      const userResponse = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      });
      res.status(201).json(userResponse);
    } catch (error) {
      next(error);
    }
  }

  // Update user
  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      await user.update(req.body);
      const updatedUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  // Delete user (Admin only)
  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      await user.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.user?.id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Residence, as: 'residence' }]
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Update current user profile
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.user?.id);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      // Prevent users from changing their role
      const { role, ...updateData } = req.body;

      await user.update(updateData);
      const updatedUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password'] }
      });

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

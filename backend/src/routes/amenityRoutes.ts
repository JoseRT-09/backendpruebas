import { Router } from 'express';
import { AmenityController } from '../controllers/amenityController';
import { authenticate, isAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', AmenityController.getAll);
router.get('/available', AmenityController.getAvailable);
router.get('/:id', AmenityController.getById);

// Admin only routes
router.post(
  '/',
  isAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('capacity').optional().isInt().withMessage('Capacity must be a number'),
    body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean')
  ],
  validateRequest,
  AmenityController.create
);

router.put(
  '/:id',
  isAdmin,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('capacity').optional().isInt().withMessage('Capacity must be a number'),
    body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean')
  ],
  validateRequest,
  AmenityController.update
);

router.delete('/:id', isAdmin, AmenityController.delete);

export default router;

import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';
import { authenticate, isAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', ActivityController.getAll);
router.get('/upcoming', ActivityController.getUpcoming);
router.get('/:id', ActivityController.getById);

// Admin only routes
router.post(
  '/',
  isAdmin,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('capacity').optional().isInt().withMessage('Capacity must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
  ],
  validateRequest,
  ActivityController.create
);

router.put(
  '/:id',
  isAdmin,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('startTime').optional().notEmpty().withMessage('Start time cannot be empty'),
    body('endTime').optional().notEmpty().withMessage('End time cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('capacity').optional().isInt().withMessage('Capacity must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
  ],
  validateRequest,
  ActivityController.update
);

router.delete('/:id', isAdmin, ActivityController.delete);

export default router;

import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Get current user profile
router.get('/profile', UserController.getProfile);

// Update current user profile
router.put(
  '/profile',
  [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  UserController.updateProfile
);

// Admin only routes
router.get('/', isAdmin, UserController.getAll);
router.get('/:id', isAdmin, UserController.getById);

router.post(
  '/',
  isAdmin,
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('role').isIn(['ADMIN', 'RESIDENT']).withMessage('Invalid role')
  ],
  validateRequest,
  UserController.create
);

router.put(
  '/:id',
  isAdmin,
  [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    body('role').optional().isIn(['ADMIN', 'RESIDENT']).withMessage('Invalid role')
  ],
  validateRequest,
  UserController.update
);

router.delete('/:id', isAdmin, UserController.delete);

export default router;

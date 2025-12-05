import { Router } from 'express';
import { ResidenceController } from '../controllers/residenceController';
import { authenticate, isAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', ResidenceController.getAll);
router.get('/available', ResidenceController.getAvailable);
router.get('/:id', ResidenceController.getById);

// Admin only routes
router.post(
  '/',
  isAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('floor').isInt().withMessage('Floor must be a number'),
    body('apartmentNumber').notEmpty().withMessage('Apartment number is required'),
    body('squareMeters').isDecimal().withMessage('Square meters must be a number'),
    body('bedrooms').isInt().withMessage('Bedrooms must be a number'),
    body('bathrooms').isInt().withMessage('Bathrooms must be a number'),
    body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).withMessage('Invalid status'),
    body('monthlyRent').isDecimal().withMessage('Monthly rent must be a number')
  ],
  validateRequest,
  ResidenceController.create
);

router.put(
  '/:id',
  isAdmin,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty'),
    body('floor').optional().isInt().withMessage('Floor must be a number'),
    body('apartmentNumber').optional().notEmpty().withMessage('Apartment number cannot be empty'),
    body('squareMeters').optional().isDecimal().withMessage('Square meters must be a number'),
    body('bedrooms').optional().isInt().withMessage('Bedrooms must be a number'),
    body('bathrooms').optional().isInt().withMessage('Bathrooms must be a number'),
    body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE']).withMessage('Invalid status'),
    body('monthlyRent').optional().isDecimal().withMessage('Monthly rent must be a number')
  ],
  validateRequest,
  ResidenceController.update
);

router.delete('/:id', isAdmin, ResidenceController.delete);

export default router;

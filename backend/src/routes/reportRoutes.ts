import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate, isAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', ReportController.getAll);
router.get('/:id', ReportController.getById);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority'),
    body('residenceId').optional().isInt().withMessage('Residence ID must be a number')
  ],
  validateRequest,
  ReportController.create
);

router.put(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('category').optional().notEmpty().withMessage('Category cannot be empty'),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).withMessage('Invalid status'),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).withMessage('Invalid priority')
  ],
  validateRequest,
  ReportController.update
);

router.delete('/:id', ReportController.delete);

export default router;

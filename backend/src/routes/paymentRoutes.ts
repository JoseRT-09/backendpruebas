import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate, isAdmin } from '../middleware/auth';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Protected routes - require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', PaymentController.getAll);
router.get('/pending', PaymentController.getPending);
router.get('/:id', PaymentController.getById);

router.put(
  '/:id',
  [
    body('status').optional().isIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).withMessage('Invalid status'),
    body('transactionId').optional().notEmpty().withMessage('Transaction ID cannot be empty')
  ],
  validateRequest,
  PaymentController.update
);

// Admin only routes
router.post(
  '/',
  isAdmin,
  [
    body('userId').isInt().withMessage('User ID is required'),
    body('residenceId').isInt().withMessage('Residence ID is required'),
    body('amount').isDecimal().withMessage('Amount must be a number'),
    body('type').isIn(['RENT', 'MAINTENANCE', 'SERVICE', 'OTHER']).withMessage('Invalid payment type'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('status').optional().isIn(['PENDING', 'PAID', 'OVERDUE', 'CANCELLED']).withMessage('Invalid status')
  ],
  validateRequest,
  PaymentController.create
);

router.delete('/:id', isAdmin, PaymentController.delete);

export default router;

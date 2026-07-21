import { Router } from 'express';
import { register, login, logout, getProfile, updateProfile, addAddress, forgotPassword, resetPassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { registerSchema, loginSchema, updateProfileSchema, addAddressSchema } from '../dto/auth.dto';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateBody(updateProfileSchema), updateProfile);
router.post('/profile/address', authenticate, validateBody(addAddressSchema), addAddress);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

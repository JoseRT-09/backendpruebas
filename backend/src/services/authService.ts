import jwt from 'jsonwebtoken';
import { User } from '../models';
import { LoginCredentials, TokenPayload } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    const { email, password } = credentials;

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      residenceId: user.residenceId
    };

    return { token, user: userResponse };
  }

  static async register(userData: any): Promise<{ token: string; user: any }> {
    const existingUser = await User.findOne({ where: { email: userData.email } });

    if (existingUser) {
      throw new ApiError(409, 'User already exists');
    }

    const user = await User.create(userData);

    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      residenceId: user.residenceId
    };

    return { token, user: userResponse };
  }
}

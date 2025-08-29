// pages/api/auth/login.js
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Check if database is available
    if (!prisma || !process.env.DATABASE_URL) {
      console.error('❌ Database not available for authentication');
      return res.status(503).json({ 
        message: 'Authentication service temporarily unavailable. Database not connected.' 
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Return user data without password
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a database connection error
    if (error.code === 'P1001' || error.message.includes('database')) {
      return res.status(503).json({ 
        message: 'Authentication service temporarily unavailable. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
}
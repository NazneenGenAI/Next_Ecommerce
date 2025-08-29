// pages/api/auth/register.js
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Check if database is available
    if (!prisma || !process.env.DATABASE_URL) {
      console.error('❌ Database not available for registration');
      return res.status(503).json({ 
        message: 'Registration service temporarily unavailable. Database not connected.' 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Check if it's a database connection error
    if (error.code === 'P1001' || error.message.includes('database')) {
      return res.status(503).json({ 
        message: 'Registration service temporarily unavailable. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
}
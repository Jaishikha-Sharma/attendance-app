import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signupUser = async (req, res) => {
  const { name, empId, email, password, role, department, attendanceCriteria } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      empId,
      email,
      password: hashedPassword,
      role,
      department,
      attendanceCriteria,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        empId: user.empId,
        role: user.role,
        department: user.department,
        attendanceCriteria: user.attendanceCriteria,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

import express from 'express';
import { body, validationResult } from 'express-validator';
import UserProfile from '../models/UserProfile.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /profile/me
router.get('/me', authMiddleware, async (req, res) => {
  const profile = await UserProfile.findOne({ userId: req.userId });
  if (!profile) return res.status(404).json({ error: 'Profile not found' });
  res.json(profile);
});

// POST /profile
router.post('/',
  authMiddleware,
  body('name').isLength({ min: 1, max: 80 }),
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() });

    const existingProfile = await UserProfile.findOne({ userId: req.userId });
    if (existingProfile) return res.status(409).json({ error: 'Profile already exists' });

    const { name, email, skills = [], projects = [], github } = req.body;
    const profile = await UserProfile.create({ name, email, skills, projects, github, userId: req.userId });
    res.status(201).json(profile);
  }
);

// PUT /profile
router.put('/',
  authMiddleware,
  body('name').isLength({ min: 1, max: 80 }),
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid input', details: errors.array() });

    const { name, email, skills = [], projects = [], github } = req.body;
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.userId },
      { name, email, skills, projects, github },
      { new: true, upsert: true }
    );
    res.json(profile);
  }
);

// DELETE /profile (optional)
router.delete('/', authMiddleware, async (req, res) => {
  await UserProfile.findOneAndDelete({ userId: req.userId });
  res.status(204).send();
});

export default router;

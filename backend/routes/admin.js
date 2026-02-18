const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAllScans,
  deleteScan,
  getProviderStats
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// ──────────────────────────────────────────────────────────────────────────────
// ALL ROUTES REQUIRE AUTHENTICATION + ADMIN ROLE
// ──────────────────────────────────────────────────────────────────────────────

router.use(protect);           // Must be logged in
router.use(restrictTo('admin')); // Must be admin

// ──────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ──────────────────────────────────────────────────────────────────────────────

// GET /api/admin/dashboard
router.get('/dashboard', getDashboardStats);

// ──────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', getAllUsers);

// GET /api/admin/users/:id
router.get('/users/:id', getUserDetails);

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', updateUserRole);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

// ──────────────────────────────────────────────────────────────────────────────
// SCAN MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

// GET /api/admin/scans
router.get('/scans', getAllScans);

// DELETE /api/admin/scans/:id
router.delete('/scans/:id', deleteScan);

// ──────────────────────────────────────────────────────────────────────────────
// SYSTEM STATS
// ──────────────────────────────────────────────────────────────────────────────

// GET /api/admin/stats/providers
router.get('/stats/providers', getProviderStats);

module.exports = router;
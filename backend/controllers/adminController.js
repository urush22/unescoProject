const User = require('../models/User');
const DetectionHistory = require('../models/DetectionHistory');
const mongoose = require('mongoose');

// ──────────────────────────────────────────────────────────────────────────────
// DASHBOARD STATS
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/dashboard
 * Get overall platform statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();
    
    // Count active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({ 
      lastLoginAt: { $gte: thirtyDaysAgo } 
    });

    // Count total scans
    const totalScans = await DetectionHistory.countDocuments();
    
    // Group scans by result (authentic, deepfake, suspicious)
    const scansByResult = await DetectionHistory.aggregate([
      { $group: { _id: '$result', count: { $sum: 1 } } }
    ]);

    // Group scans by type (image, video, audio)
    const scansByType = await DetectionHistory.aggregate([
      { $group: { _id: '$detectionType', count: { $sum: 1 } } }
    ]);

    // Calculate average confidence
    const avgConfidenceResult = await DetectionHistory.aggregate([
      { $group: { _id: null, avg: { $avg: '$confidence' } } }
    ]);

    // Get scans per day for last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const scansOverTime = await DetectionHistory.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top 5 users by scan count
    const topUsers = await DetectionHistory.aggregate([
      { $group: { _id: '$user', scanCount: { $sum: 1 } } },
      { $sort: { scanCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: 1,
          scanCount: 1,
          email: '$userInfo.email',
          name: '$userInfo.name'
        }
      }
    ]);

    // Get 10 most recent scans
    const recentScans = await DetectionHistory.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .select('fileName detectionType result confidence provider createdAt');

    // Send response
    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers
        },
        scans: {
          total: totalScans,
          byResult: scansByResult.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          byType: scansByType.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          avgConfidence: avgConfidenceResult[0]?.avg || 0
        },
        trends: {
          scansOverTime: scansOverTime.map(d => ({ 
            date: d._id, 
            count: d.count 
          })),
          topUsers
        },
        recentScans
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// USER MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/users
 * Get all users with pagination, search, and filters
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    // Build filter
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    // Get users
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add scan count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const scanCount = await DetectionHistory.countDocuments({ 
          user: user._id 
        });
        return {
          ...user.toObject(),
          scanCount
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: usersWithStats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * GET /api/admin/users/:id
 * Get detailed info about a specific user
 */
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get user's scan history (last 50)
    const scans = await DetectionHistory.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    // Get user's statistics
    const totalScans = await DetectionHistory.countDocuments({ 
      user: user._id 
    });
    
    const scansByResult = await DetectionHistory.aggregate([
      { $match: { user: mongoose.Types.ObjectId(user._id) } },
      { $group: { _id: '$result', count: { $sum: 1 } } }
    ]);

    const scansByType = await DetectionHistory.aggregate([
      { $match: { user: mongoose.Types.ObjectId(user._id) } },
      { $group: { _id: '$detectionType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      user: user.toObject(),
      stats: {
        totalScans,
        byResult: scansByResult.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        byType: scansByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      recentScans: scans
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * PATCH /api/admin/users/:id/role
 * Change user's role (promote to admin or demote to user)
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role. Must be "user" or "admin".' 
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && role === 'user') {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot demote yourself.' 
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user and all their scan history
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot delete your own account.' 
      });
    }

    // Delete all user's scans
    const deletedScans = await DetectionHistory.deleteMany({ 
      user: user._id 
    });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User and associated data deleted successfully',
      deletedScans: deletedScans.deletedCount
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// SCAN MANAGEMENT
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/scans
 * Get all scans from all users
 */
const getAllScans = async (req, res) => {
  try {
    const { page = 1, limit = 20, detectionType, result, userId } = req.query;

    // Build filter
    const filter = {};
    if (detectionType) filter.detectionType = detectionType;
    if (result) filter.result = result;
    if (userId) filter.user = userId;

    // Get scans with user info
    const scans = await DetectionHistory.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DetectionHistory.countDocuments(filter);

    res.json({
      success: true,
      data: scans,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * DELETE /api/admin/scans/:id
 * Delete any scan (admin can delete scans from any user)
 */
const deleteScan = async (req, res) => {
  try {
    const scan = await DetectionHistory.findByIdAndDelete(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ 
        success: false, 
        message: 'Scan not found' 
      });
    }

    res.json({
      success: true,
      message: 'Scan deleted successfully'
    });

  } catch (error) {
    console.error('Delete scan error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// SYSTEM STATS
// ──────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/stats/providers
 * Get usage statistics for each detection provider
 */
const getProviderStats = async (req, res) => {
  try {
    const providerStats = await DetectionHistory.aggregate([
      { $group: { _id: '$provider', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: providerStats.map(p => ({ 
        provider: p._id, 
        count: p.count 
      }))
    });

  } catch (error) {
    console.error('Provider stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ──────────────────────────────────────────────────────────────────────────────

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAllScans,
  deleteScan,
  getProviderStats
};
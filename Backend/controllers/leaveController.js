import Leave from '../models/Leave.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

export const applyLeave = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, reason } = req.body;

    const existing = await Leave.findOne({ userId, date });
    if (existing) {
      return res.status(400).json({ message: 'Leave already applied for this date' });
    }

    const leave = new Leave({ userId, date, reason });
    await leave.save();

    res.status(200).json({ message: 'Leave request submitted', leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getHRSummary = async (req, res) => {
  try {
    const requester = await User.findById(req.user.id);
    if (!requester || (requester.role !== 'HR' && requester.role !== 'Admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // Total employees (excluding Admins)
    const totalEmployees = await User.countDocuments({ role: { $ne: 'Admin' } });

    // Users on leave
    const onLeave = await User.countDocuments({ isOnLeave: true });

    // Pending leave requests
    const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });

    // Present today
    const presentToday = await Attendance.countDocuments({
      date: todayStr,
      punchInTime: { $ne: null },
    });

    // 🟦 Daily Attendance (Last 7 Days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      return d.toISOString().slice(0, 10);
    }).reverse();

    const dailyAttendance = await Promise.all(
      last7Days.map(async (date) => {
        const present = await Attendance.countDocuments({ date, punchInTime: { $ne: null } });
        return { day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), present };
      })
    );

    // 🟧 Leave Trends (Last 7 Days)
    const leaveTrends = await Promise.all(
      last7Days.map(async (date) => {
        const leaves = await Leave.countDocuments({ date });
        return { day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), leaves };
      })
    );

    // 🟨 Department-wise Employee Count
    const deptDataRaw = await User.aggregate([
      { $match: { role: { $ne: 'Admin' } } },
      {
        $group: {
          _id: '$department',
          value: { $sum: 1 },
        },
      },
    ]);

    const deptData = deptDataRaw.map((d) => ({
      name: d._id || 'Unknown',
      value: d.value,
    }));

    res.status(200).json({
      totalEmployees,
      onLeave,
      pendingLeaves,
      presentToday,
      dailyAttendance,
      leaveTrends,
      deptData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'HR summary fetch failed' });
  }
};

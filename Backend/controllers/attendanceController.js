import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// ===== PUNCH IN CONTROLLER =====
export const punchIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const today = now.toISOString().slice(0, 10);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Leave check
    if (user.isOnLeave) {
      return res.status(200).json({ message: 'User is on leave today, no attendance needed' });
    }

    // Rule 1: Admin
    if (user.role === 'Admin') {
      return res.status(400).json({ message: 'Admin does not punch in' });
    }

    // Rule 2: Freelancer (only Sunday)
    if (user.role === 'Freelancer') {
      const day = now.getDay(); // Sunday = 0
      if (day !== 0) {
        return res.status(400).json({ message: 'Freelancers can punch in only on Sunday' });
      }
    }

    // Rule 3: Regular (Co-Admin, Employee, HR) – 11:00 to 11:30 AM
    if (
      user.attendanceCriteria === 'Regular' ||
      user.role === 'Co-Admin' ||
      user.role === 'Employee' ||
      user.role === 'HR'
    ) {
      const punchInStart = new Date(now);
      punchInStart.setHours(11, 0, 0, 0);
      const punchInEnd = new Date(now);
      punchInEnd.setHours(11, 30, 0, 0);

      if (now < punchInStart || now > punchInEnd) {
        return res.status(400).json({ message: 'Punch in allowed only between 11:00 and 11:30 AM' });
      }
    }

    // Rule 4: Project Coordinator – 9:00 AM to 3:00 PM
    if (user.role === 'Project Coordinator') {
      const punchInStart = new Date(now);
      punchInStart.setHours(9, 0, 0, 0);
      const punchInEnd = new Date(now);
      punchInEnd.setHours(15, 0, 0, 0);

      if (now < punchInStart || now > punchInEnd) {
        return res.status(400).json({ message: 'Project Coordinators punch in between 9 AM and 3 PM only' });
      }
    }

    let attendance = await Attendance.findOne({ userId, date: today });
    if (attendance && attendance.punchInTime) {
      return res.status(400).json({ message: 'Already punched in today' });
    }

    if (!attendance) {
      attendance = new Attendance({ userId, date: today });
    }

    attendance.punchInTime = now;
    attendance.autoPunchIn = false;
    attendance.status = 'Present';

    await attendance.save();

    res.status(200).json({ message: 'Punch in successful', attendance, punchInTime: attendance.punchInTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== PUNCH OUT CONTROLLER =====
export const punchOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const today = now.toISOString().slice(0, 10);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ Leave check
    if (user.isOnLeave) {
      return res.status(200).json({ message: 'User is on leave today, no attendance needed' });
    }

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance || !attendance.punchInTime) {
      return res.status(400).json({ message: 'You must punch in first' });
    }

    if (attendance.punchOutTime) {
      return res.status(400).json({ message: 'Already punched out today' });
    }

    // Rule: Admins can't punch out
    if (user.role === 'Admin') {
      return res.status(400).json({ message: 'Admin does not punch out' });
    }

    // Rule: Regular (Co-Admin, Employee, HR) - only after 7 PM
    if (
      user.attendanceCriteria === 'Regular' ||
      user.role === 'Co-Admin' ||
      user.role === 'Employee' ||
      user.role === 'HR'
    ) {
      const allowedPunchOut = new Date(now);
      allowedPunchOut.setHours(19, 0, 0, 0); // 7 PM
      if (now < allowedPunchOut) {
        return res.status(400).json({ message: 'Punch out allowed only after 7 PM' });
      }
    }

    // Rule: Project Coordinator - only after 9 PM
    if (user.role === 'Project Coordinator') {
      const allowedPunchOut = new Date(now);
      allowedPunchOut.setHours(21, 0, 0, 0); // 9 PM
      if (now < allowedPunchOut) {
        return res.status(400).json({ message: 'Project Coordinators punch out only after 9 PM' });
      }
    }

    attendance.punchOutTime = now;
    await attendance.save();

    res.status(200).json({ message: 'Punch out successful', attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== GET MONTHLY ATTENDANCE SUMMARY =====
export const getMonthlyAttendanceSummary = async (req, res) => {
  try {
    const requester = await User.findById(req.user.id);
    if (!requester || (requester.role !== 'Admin' && requester.role !== 'HR')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDateObj = new Date(year, month, 0);
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${endDateObj.getDate()}`;

    const summary = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$userId",
          totalDaysPresent: {
            $sum: { $cond: [{ $ifNull: ["$punchInTime", false] }, 1, 0] }
          },
          totalAutoPunchIn: {
            $sum: { $cond: ["$autoPunchIn", 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          role: "$userDetails.role",
          department: "$userDetails.department",
          totalDaysPresent: 1,
          totalAutoPunchIn: 1
        }
      }
    ]);

    res.status(200).json({ month, year, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ===== GET TODAY'S ATTENDANCE STATUS =====
export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const today = now.toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance || !attendance.punchInTime) {
      return res.status(200).json({ punchedIn: false });
    }

    res.status(200).json({
      punchedIn: true,
      punchInTime: attendance.punchInTime
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get today\'s status' });
  }
};
export const getUserPunchHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Attendance.find({ userId }).sort({ date: -1 });
    res.status(200).json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch attendance history' });
  }
};

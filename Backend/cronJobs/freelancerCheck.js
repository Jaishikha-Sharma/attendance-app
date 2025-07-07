import cron from 'node-cron';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

const freelancerCheckJob = cron.schedule('1 0 * * 1', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const sundayDate = yesterday.toISOString().slice(0, 10);

  console.log('🕐 Checking freelancer punch-in for Sunday...');

  const freelancers = await User.find({ role: 'Freelancer', isOnLeave: false });

  for (const user of freelancers) {
    const sundayAttendance = await Attendance.findOne({
      userId: user._id,
      date: sundayDate
    });

    if (!sundayAttendance || !sundayAttendance.punchInTime) {
      const existing = await Attendance.findOne({ userId: user._id, date: today });

      if (!existing) {
        const attendance = new Attendance({
          userId: user._id,
          date: today,
          punchInTime: now,
          autoPunchIn: true,
          status: 'Absent - Missed Sunday'
        });

        await attendance.save();
        console.log(`⚠️ Freelancer missed Sunday. Auto marked absent: ${user.name}`);
      }
    }
  }
});

export default freelancerCheckJob;

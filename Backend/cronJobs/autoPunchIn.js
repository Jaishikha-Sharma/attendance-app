import cron from 'node-cron';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// ✅ CRON JOB: Runs at 3:00 PM IST (9:30 AM UTC), Monday–Saturday
const autoPunchInJob = cron.schedule('30 9 * * 1-6', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  console.log('⏰ [Auto Punch-In] Running at:', now.toLocaleString());

  try {
    const coordinators = await User.find({
      role: 'Project Coordinator',
      isOnLeave: false
    });

    console.log('📋 Coordinators found:', coordinators.length);

    for (const user of coordinators) {
      const existing = await Attendance.findOne({ userId: user._id, date: today });

      if (!existing) {
        const attendance = new Attendance({
          userId: user._id,
          date: today,
          punchInTime: now,
          autoPunchIn: true,
          status: 'Present (Auto)'
        });

        await attendance.save();
        console.log(`✅ Auto punch-in done for: ${user.name}`);
      } else {
        console.log(`⏭️ Already punched in: ${user.name}`);
      }
    }
  } catch (error) {
    console.error('❌ Auto Punch-In Error:', error.message);
  }
});

export default autoPunchInJob;

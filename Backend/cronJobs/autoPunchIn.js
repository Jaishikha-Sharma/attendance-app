import cron from 'node-cron';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

const autoPunchInJob = cron.schedule(
  '1 15 * * 1-6', // Runs at 3:01 PM IST Monday to Saturday
  async () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    // Use date string yyyy-mm-dd for querying Attendance by date field
    const todayStr = now.toISOString().slice(0, 10);

    console.log('⏰ [Auto Punch-In] Running at:', now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

    try {
      // Find Project Coordinators who are not on leave
      const coordinators = await User.find({
        role: 'Project Coordinator',
        isOnLeave: false,
      });

      if (coordinators.length === 0) {
        console.log('📭 No coordinators found for auto punch-in.');
        return;
      }

      console.log('📋 Coordinators found:', coordinators.map(u => u.name).join(', '));

      for (const user of coordinators) {
        // Check if attendance already exists today for the user
        const existing = await Attendance.findOne({
          userId: user._id,
          date: todayStr,
        });

        if (!existing) {
          const attendance = new Attendance({
            userId: user._id,
            date: todayStr,
            punchInTime: now,
            autoPunchIn: true,
            status: 'Present (Auto)',
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
  },
  {
    timezone: 'Asia/Kolkata',
  }
);

export default autoPunchInJob;

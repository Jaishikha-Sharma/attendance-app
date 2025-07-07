import cron from 'node-cron';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// ✅ CRON JOB: Runs at 11:31 AM, Mon–Sat
const autoPunchInJob = cron.schedule('31 11 * * 1-6', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  console.log('⏰ Auto Punch-In job running at:', now.toLocaleTimeString());

  // 🔸 Regular Users: Co-Admin, Employee, HR (ignore attendanceCriteria for now)
  const users = await User.find({
    isOnLeave: false,
    role: { $in: ['Co-Admin', 'Employee', 'HR'] }
  });

  console.log('🧑‍💼 Regular Users Found:', users.length);

  for (const user of users) {
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
      console.log(`✅ Auto punch-in marked for: ${user.name}`);
    }
  }

  // 🔸 Freelancers (Mon–Sat auto punch-in)
  const freelancers = await User.find({
    role: 'Freelancer',
    isOnLeave: false
  });

  console.log('🎨 Freelancers Found:', freelancers.length);

  for (const freelancer of freelancers) {
    const existing = await Attendance.findOne({ userId: freelancer._id, date: today });

    if (!existing) {
      const attendance = new Attendance({
        userId: freelancer._id,
        date: today,
        punchInTime: now,
        autoPunchIn: true,
        status: 'Present (Auto)'
      });

      await attendance.save();
      console.log(`✅ Auto punch-in (freelancer) marked for: ${freelancer.name}`);
    }
  }
});

export default autoPunchInJob;

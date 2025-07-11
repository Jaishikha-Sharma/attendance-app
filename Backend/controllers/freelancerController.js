import User from '../models/User.js';

export const createFreelancer = async (req, res) => {
  try {
    const {
      empId, name, email, password, // password should be hashed in real apps
      contactNo, state,
      department, role, joiningDate, status,
      dob, address, stream, course
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Freelancer already exists" });
    }

    const freelancer = new User({
      empId,
      name,
      email,
      password,
      role: role || "Freelancer",
      contactNo,
      state,
      department,
      joiningDate,
      status,
      dob,
      address,
      stream,
      course,
      createdBy: req.user.id,
    });

    await freelancer.save();
    res.status(201).json({ message: "Freelancer created", freelancer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create freelancer" });
  }
};

export const getFreelancers = async (req, res) => {
  try {
    const freelancers = await User.find({ role: "Freelancer" }).sort({ createdAt: -1 });
    res.status(200).json(freelancers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch freelancers" });
  }
};

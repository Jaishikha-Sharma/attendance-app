import Freelancer from '../models/Freelancer.js';

export const createFreelancer = async (req, res) => {
  try {
    const {
      employeeId, name, email, contactNo, state,
      department, role, joiningDate, status,
      dob, address, stream, course
    } = req.body;

    const existing = await Freelancer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Freelancer already exists" });
    }

    const freelancer = new Freelancer({
      employeeId,
      name,
      email,
      contactNo,
      state,
      department,
      role,
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
    const freelancers = await Freelancer.find().sort({ createdAt: -1 });
    res.status(200).json(freelancers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch freelancers" });
  }
};

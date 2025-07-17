import User from '../models/User.js';

// ✅ Create Freelancer (used by HR/Admin only)
export const createFreelancer = async (req, res) => {
  try {
    const {
      empId,
      name,
      email,
      password,
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
      aadhaarCardNumber, // ✅ updated
      panCardNumber,     // ✅ updated
      tags,
      activityTime,
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
      contactNo,
      state,
      department,
      role: role || "Freelancer",
      joiningDate,
      status,
      dob,
      address,
      stream,
      course,
      aadhaarCardNumber, // ✅ updated
      panCardNumber,     // ✅ updated
      tags,
      activityTime,
      createdBy: req.user?.id,
    });

    await freelancer.save();
    res.status(201).json({ message: "Freelancer created", freelancer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create freelancer" });
  }
};

// ✅ Get all Freelancers
export const getFreelancers = async (req, res) => {
  try {
    const freelancers = await User.find({ role: "Freelancer" }).sort({ createdAt: -1 });
    res.status(200).json(freelancers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch freelancers" });
  }
};

// ✅ Update Freelancer Actionables
export const updateFreelancerActionables = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      activityTime,
      aadhaarCardNumber, // ✅ updated
      panCardNumber,     // ✅ updated
      tags,
    } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      {
        status,
        activityTime,
        aadhaarCardNumber, // ✅ updated
        panCardNumber,     // ✅ updated
        tags,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Freelancer not found" });
    }

    res.status(200).json({ message: "Freelancer updated", updated });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update freelancer" });
  }
};

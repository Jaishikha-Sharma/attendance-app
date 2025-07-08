import Lead from '../models/Lead.js';

// ➕ Add New Lead
export const createLead = async (req, res) => {
  try {
    // Get latest lead number
    const latestLead = await Lead.findOne().sort({ createdAt: -1 });
    const lastNum = latestLead?.leadNo?.replace('#PBL', '') || '2100';
    const newNum = parseInt(lastNum) + 1;
    const leadNo = `#PBL${newNum}`;
    const leadDate = new Date();

    // Create new lead with actionedBy
    const lead = new Lead({
      ...req.body,
      leadNo,
      leadDate,
      actionedBy: req.user.name, // 👈 Important for role-based filtering
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 📥 Get All Leads (Role-Based)
export const getAllLeads = async (req, res) => {
  try {
    const user = req.user;

    let leads;

    if (user.role === 'Admin' || user.role === 'Co-Admin') {
      // Admins can see all leads
      leads = await Lead.find().sort({ createdAt: -1 });
    } else {
      // Others see only their leads
      leads = await Lead.find({ actionedBy: user.name }).sort({ createdAt: -1 });
    }

    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 🔍 Get Lead by ID
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

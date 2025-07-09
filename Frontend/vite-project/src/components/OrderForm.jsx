import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetOrderState } from "../redux/orderSlice";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { ORDER_API } from "../utils/Constant";

const initialForm = {
  orderDate: "",
  customerName: "",
  customerEmail: "",
  customerAddress: "",
  contact: "",
  country: "",
  state: "",
  notes: "",
  leadSource: "",
  customerType: "",
  deadline: "",
  projectType: "",
  topic: "",
  purpose: "",
  institution: "",
  sellingPrice: "",
  advanceAmount: "",
  advanceMode: "",
  projectCoordinator: "",
};

const countryStateData = {
  India: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ],
  "Antigua and Barbuda": ["All Saints"],
  USA: ["California", "Texas", "Florida", "New York"],
  UK: ["England", "Scotland", "Wales", "Northern Ireland"],
};

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Myanmar",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Cook Islands",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Timor-Leste",
  "Tokelau",
  "Turks and Caicos Islands",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Faroe Islands",
  "Falkland Islands",
  "Fiji",
  "Guatemala",
  "Guam",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and McDonald Islands",
  "Jordan",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "USA",
  "UK",
];

const OrderForm = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.order);
  const [form, setForm] = useState(initialForm);
  const [coordinators, setCoordinators] = useState([]);

  useEffect(() => {
    if (success) {
      toast.success("Order created successfully!");
      setForm(initialForm);
      dispatch(resetOrderState());
    }
    if (error) {
      toast.error(`❌ ${error}`);
      dispatch(resetOrderState());
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createOrder(form));
  };

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await axios.get(`${ORDER_API}/project-coordinators`);
        setCoordinators(res.data);
      } catch (err) {
        console.error("Failed to fetch coordinators", err);
      }
    };
    fetchCoordinators();
  }, []);

  const availableStates = countryStateData[form.country] || [];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg  animate-fade-in text-sm">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        New Order Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {[
          ["Order Date", "orderDate", "date"],
          ["Customer Name", "customerName"],
          ["Email", "customerEmail", "email"],
          ["Address", "customerAddress"],
          ["Contact No.", "contact"],
          ["Project Topic", "topic"],
          ["Institution", "institution"],
          ["Selling Price", "sellingPrice", "number"],
          ["Advance Paid", "advanceAmount", "number"],
          ["Advance Mode (e.g. UPI, Cash)", "advanceMode"],
        ].map(([label, name, type = "text"]) => (
          <div key={name}>
            <label className="text-xs text-gray-600 font-semibold mb-1 block">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              required={name === "orderDate" || name === "customerName"}
            />
          </div>
        ))}

        {/* Country Dropdown */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Country
          </label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            State
          </label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select State</option>
            {availableStates.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Lead Source */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Lead Source
          </label>
          <select
            name="leadSource"
            value={form.leadSource}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Source</option>
            <option value="social media">Social Media</option>
            <option value="reference">Reference</option>
            <option value="website">Website</option>
          </select>
        </div>

        {/* Customer Type */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Customer Type
          </label>
          <select
            name="customerType"
            value={form.customerType}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Type</option>
            <option value="new">New</option>
            <option value="old">Old</option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Project Type */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Project Type
          </label>
          <select
            name="projectType"
            value={form.projectType}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Type</option>
            <option value="handmade">Handmade</option>
            <option value="digital">Digital</option>
            <option value="both">Both</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Purpose
          </label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">Select Purpose</option>
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-md px-3 py-2 resize-none"
            placeholder="Any additional information..."
          ></textarea>
        </div>
        <div>
          <label className="text-xs text-gray-600 font-semibold mb-1 block">
            Assign Project Coordinator
          </label>
          <select
            name="projectCoordinator"
            value={form.projectCoordinator}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select Coordinator</option>
            {coordinators.map((co) => (
              <option key={co._id} value={co._id}>
                {co.name} ({co.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 mt-2 bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition flex justify-center items-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "🚀 Submit Order"
          )}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

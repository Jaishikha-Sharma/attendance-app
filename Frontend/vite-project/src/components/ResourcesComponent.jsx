import React, { useState } from "react";
import { Mail, Phone, ShieldCheck, BookOpenText, Gavel } from "lucide-react";

const ResourcesComponent = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { key: "about", label: "About Us" },
    { key: "contact", label: "Contact Us" },
    { key: "privacy", label: "Privacy Policy" },
    { key: "terms", label: "Terms & Conditions" },
    { key: "learning", label: "Learning Material" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm transition-all duration-200 border ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md space-y-5 border border-gray-100 text-sm sm:text-base leading-relaxed">
        {activeTab === "about" && (
          <>
            <h2 className="text-xl font-bold text-indigo-700">
              About Project Banao™
            </h2>
            <p className="text-gray-700">
              <strong>Project Banao™</strong> (Richimono Designs Pvt. Ltd.) is a
              registered company under the Companies Act, 2013.
            </p>
            <p className="text-xs text-gray-500">CIN: U74102DL2023PTC410918</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {[
                { emoji: "🎨", title: "Artistic Projects" },
                { emoji: "🧑‍🎓", title: "Thesis & Dissertation" },
                { emoji: "💻", title: "Coding Projects" },
                { emoji: "🖼️", title: "Graphic Design" },
                { emoji: "📚", title: "Internship Reports" },
                { emoji: "✍️", title: "Creative Writing" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <h4 className="font-semibold text-indigo-800 text-sm">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <a
                href="https://projectbanao.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition-all duration-200"
              >
                🌐 View More on Official Website
              </a>
            </div>

            <p className="mt-4 text-gray-700">
              📆 <strong>Founded in April 2017</strong> by{" "}
              <strong>Mr. Mohit Verma</strong> with the goal of reducing stress
              for students & professionals facing project deadlines.
            </p>
            <p className="text-gray-700">
              Clients across India rely on Project Banao™ for fast and
              customized project solutions.
            </p>
          </>
        )}

        {activeTab === "contact" && (
          <>
            <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <Mail size={20} /> Contact Information
            </h2>
            <p>📩 projectbanaoindia@gmail.com</p>
            <p>📞 +91 8700969107, 8368662288</p>
            <p>🕘 9 AM – 9 PM IST (All days)</p>
          </>
        )}

        {activeTab === "privacy" && (
          <>
            <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <ShieldCheck size={20} /> Privacy Policy
            </h2>
            <p>
              We collect minimal user data (name, phone, address) to deliver
              services. Cookies help improve experience.
            </p>
            <p>
              Data shared with third-party services is protected under
              confidentiality agreements.
            </p>
            <p>
              We don’t collect data from children under 13. Though secure
              systems are used, no method is foolproof.
            </p>
          </>
        )}

        {activeTab === "terms" && (
          <>
            <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <Gavel size={20} /> Terms & Conditions
            </h2>
            <p>
              By using Project Banao™, you agree to our terms. Misuse or
              unethical behavior may lead to order cancellation or user ban.
            </p>
          </>
        )}

        {activeTab === "learning" && (
          <>
            <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <BookOpenText size={20} /> Learning Material
            </h2>
            <p>
              Coming Soon! 🎓 Access tutorials, guides, and templates to level
              up your skills.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResourcesComponent;

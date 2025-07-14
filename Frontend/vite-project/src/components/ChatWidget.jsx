import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Icon - Bottom Right */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition duration-300 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Iframe Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-4xl h-[80%] relative flex flex-col overflow-hidden">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md"
              >
                ✖ Close
              </button>
            </div>

            <iframe
              src="https://chat-app-zeta-sooty-37.vercel.app/"
              title="Chat App"
              className="w-full flex-1 border-none rounded-b-xl"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;

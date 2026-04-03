import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

export default function ChatSessionsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="flex">
        <Sidebar />

        <div className="w-px bg-gray-300"></div>

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="p-4">
            <Navbar />
          </div>

          <hr className="border-gray-300" />
        </div>
      </div>
    </div>
  );
}

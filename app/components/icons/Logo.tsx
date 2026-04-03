import { FaRobot } from "react-icons/fa";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg ">
      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
        <FaRobot size={18} />
      </div>
      <span className="text-gray-900">ChatBotPro</span>
    </div>
  );
}

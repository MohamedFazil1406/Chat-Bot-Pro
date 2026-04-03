import BotCard from "@/app/components/BotCard";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

export default function BotsPage() {
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
          <div className="bg-[#efeff6] min-h-screen ">
            <div className="grid grid-cols-3 gap-4 mt-5 ml-5">
              <BotCard
                name={"HR Assistant"}
                description={"Handles HR-related queries"}
                botType={"hr"}
              />
              <BotCard
                name={"SalesBot"}
                description={"Generates sales leads and insights"}
                botType={"sales"}
              />
              <BotCard
                name={"SupportBot"}
                description={"Provides customer support and assistance"}
                botType={"support"}
              />
              <BotCard
                name={"MarketingBot"}
                description={"Creates marketing campaigns and content"}
                botType={"marketing"}
              />
              <BotCard
                name={"SurveyBot"}
                description={"Conducts surveys and collects feedback"}
                botType={"survey"}
              />
              <BotCard
                name={"BookingBot"}
                description={"Manages appointments and bookings"}
                botType={"booking"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

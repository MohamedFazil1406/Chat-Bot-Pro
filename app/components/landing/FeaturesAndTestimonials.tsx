import { MessageCircle, BarChart3, Settings } from "lucide-react";

export default function FeaturesAndTestimonials() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* FEATURES */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Powerful Features to Enhance Customer Engagement
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-black">
              AI-Powered Chatbots
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Deploy intelligent chatbots that can handle customer inquiries
              24/7, reducing workload and improving response times.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-black">
              Analytics & Insights
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Track and analyze chatbot performance with detailed analytics and
              make data-driven decisions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <Settings className="h-8 w-8 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-black">
              Easy Integration
            </h3>
            <p className="mt-2 text-slate-600 text-sm">
              Seamlessly integrate ChatBotPro with your existing tools and
              platforms, including CRM and support software.
            </p>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            What Our Customers Say
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-semibold text-black">Sarah Johnson</p>
                <p className="text-xs text-slate-500">
                  Customer Support Manager
                </p>
              </div>
            </div>

            <div className="mt-3 text-yellow-400">★★★★★</div>

            <p className="mt-3 text-sm text-slate-600">
              “ChatBotPro transformed our customer support process. The AI
              chatbots are incredibly efficient.”
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-semibold text-black">Mark Thompson</p>
                <p className="text-xs text-slate-500">Sales Director</p>
              </div>
            </div>

            <div className="mt-3 text-yellow-400">★★★★★</div>

            <p className="mt-3 text-sm text-slate-600">
              “With ChatBotPro, we reduced response time by 50% and improved
              customer satisfaction.”
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div>
                <p className="font-semibold text-black">Emily Carter</p>
                <p className="text-xs text-slate-500">HR Specialist</p>
              </div>
            </div>

            <div className="mt-3 text-yellow-400">★★★★★</div>

            <p className="mt-3 text-sm text-slate-600">
              “The integration was seamless, and the analytics are a
              game-changer for our team.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

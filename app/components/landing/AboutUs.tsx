import Image from "next/image";
import { Lightbulb, ShieldCheck, Target } from "lucide-react";

export default function AboutUs() {
  return (
    <section id="aboutus" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* ABOUT US HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">About Us</h2>
            <p className="mt-2 text-lg text-slate-600">
              Empowering Businesses with AI Technology
            </p>

            <p className="mt-4 text-slate-500 max-w-lg">
              At ChatBot Pro, we build intelligent AI-powered chatbot solutions
              that help businesses automate conversations, enhance customer
              engagement, and scale support effortlessly.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/about-team.png"
              alt="Team working together"
              width={300}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* OUR MISSION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>

            <p className="mt-4 text-slate-600 max-w-lg">
              <span className="text-blue-600 font-semibold">•</span> At ChatBot
              Pro, our mission is to revolutionize customer interactions through
              AI-powered solutions, helping businesses improve customer support
              and drive growth.
            </p>
          </div>

          {/* ROBOT IMAGE */}
          <div className="flex justify-center">
            <Image src="/robot.png" alt="AI Robot" width={300} height={300} />
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div>
          <h3 className="text-3xl font-bold text-center text-slate-900">
            Why Choose Us?
          </h3>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md transition">
              <Lightbulb className="h-10 w-10 text-blue-600 mx-auto" />
              <h4 className="mt-4 font-semibold text-black">
                Innovative Technology
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                Cutting-edge AI solutions tailored for your business.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md transition">
              <ShieldCheck className="h-10 w-10 text-green-600 mx-auto" />
              <h4 className="mt-4 font-semibold text-black">
                Reliable Support
              </h4>
              <p className="mt-2 text-sm text-slate-600">
                24/7 dedicated customer service you can trust.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border bg-white p-6 text-center shadow-sm hover:shadow-md transition">
              <Target className="h-10 w-10 text-red-600 mx-auto" />
              <h4 className="mt-4 font-semibold text-black">Proven Results</h4>
              <p className="mt-2 text-sm text-slate-600">
                Demonstrated success across multiple industries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

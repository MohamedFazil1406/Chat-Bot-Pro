import Logo from "../app/components/icons/Logo";
import Hero from "../app/components/landing/Hero";
import FeaturesAndTestimonials from "../app/components/landing/FeaturesAndTestimonials";
import AboutUs from "./components/landing/AboutUs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbfbfd]">
      <div className="bg-[#fbfbfd]">
        <div className="shadow-[0_2px_0_0_rgba(0,0,0,0.15)] pb-2 bg-white rounded sticky top-0 z-50  ">
          <header className=" ml-10 pt-2.5 flex flex-row gap-165 ">
            <Logo />
            <div className="text-[#6b6981] flex flex-row gap-10 items-center mr-10">
              <a href="#features">Feature</a>
              <a href="#">Pricing</a>
              <a href="#aboutus">About us</a>
              <a href="#">Contact</a>
              <button className="bg-[#4379e8] text-white p-1 rounded">
                <a href="/login">Sign in</a>
              </button>
            </div>
          </header>
        </div>
        <div className="flex flex-col">
          <Hero />
          <FeaturesAndTestimonials />
          <AboutUs />
        </div>
      </div>
    </div>
  );
}

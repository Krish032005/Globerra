import "./CSS/About.css";
import Footer from "./Footer";
import about1 from "./assets/aboutImg.jpg";
import Navbarone from "./Components/Navbarone";

export default function About() {
  return (
    <>
      <div className="about-main">

        <Navbarone />

        {/* Main About Card */}
        <div id="main-card" className="w-[90%] max-w-7xl mx-auto mt-16 mb-10 bg-white rounded-[25px] p-6 md:p-10">

          {/* Heading */}
          <h3 className="text-2xl md:text-3xl font-medium mb-3">
            About Us
          </h3>

          {/* Intro */}
          <p className="top-p text-base md:text-lg font-bold mb-2">
            Welcome to Globerra – your smart and personalized trip planning
            companion.
          </p>

          <p className="text-base md:text-lg leading-relaxed mb-6">
            At Globerra, we believe that every journey should be as unique as
            the traveler. Planning a trip can often feel overwhelming —
            choosing destinations, organizing itineraries, managing budgets,
            and coordinating schedules. That’s where we step in.
          </p>


          {/* Main Content */}
          <div className="
            grid
            grid-cols-1
            md:grid-cols-[220px_1fr_1fr]
            gap-8
            items-start
          ">

            {/* Image */}
            <div className="flex justify-center md:justify-start">
              <img
                src={about1}
                alt="Globerra travel"
                className="
                  w-full
                  max-w-75
                  md:w-55
                  md:h-67.5
                  object-cover
                  rounded-xl
                "
              />
            </div>


            {/* Why Choose */}
            <div>
              <h4 className="text-xl md:text-2xl font-medium mb-3">
                Why Choose Globerra?
              </h4>

              <ul className="
                list-disc
                pl-5
                text-base md:text-lg
                space-y-1
              ">
                <li>Personalized trip planning</li>
                <li>Easy-to-use interface</li>
                <li>Organized itinerary creation</li>
                <li>Budget-friendly planning options</li>
                <li>
                  Suitable for solo travelers, families, and groups
                </li>
              </ul>
            </div>


            {/* Mission */}
            <div>
              <h4 className="text-xl md:text-2xl font-medium mb-3">
                Our Mission
              </h4>

              <p className="text-base md:text-lg leading-relaxed mb-3">
                We aim to eliminate the stress of organizing trips by
                providing a platform where users can:
              </p>

              <ul className="
                list-disc
                pl-5
                text-base md:text-lg
                space-y-1
              ">
                <li>Select destinations based on their interests</li>
                <li>Customize itineraries day-by-day</li>
                <li>Plan according to budget preferences</li>
              </ul>
            </div>


            {/* Vision */}
            <div className="
              md:col-start-2
              md:col-span-2
              mt-2
            ">
              <h4 className="text-xl md:text-2xl font-medium mb-2 ">
                Our Vision
              </h4>

              <p className="text-base md:text-lg leading-relaxed">
                At Globerra, we envision a world where travel planning is
                exciting, not stressful. A world where every traveler can
                design their perfect journey without confusion or compromise.
              </p>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}
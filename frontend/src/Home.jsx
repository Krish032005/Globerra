import Navbar from "./Navbar";
import Contenthome from "./Contenthome";
import Bodyhome from "./Bodyhome";
import "./CSS/Home.css";

import { useUser } from "@clerk/react";
import { useState } from "react";

export default function Home() {
  const { isSignedIn } = useUser();
  const [showToast, setShowToast] = useState(false);

  const handleProtectedClick = () => {
    if (!isSignedIn) {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="home-main">
        <div onClick={handleProtectedClick}>
           <Navbar />
        </div>
        
          <Contenthome />
        

        <div onClick={handleProtectedClick}>
          <Bodyhome />
        </div>
      </div>

      {showToast && (
        <div className="custom-toast">
          Sign in to explore
        </div>
      )}
    </>
  );
}
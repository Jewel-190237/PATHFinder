import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import SkillSpecialistDashboardHeader from "./SkillSpecialistDashboardHeader";
import { useEffect, useState } from "react";
import GetUser from "../../Backend/GetUser";

const SkillSpecialistDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = GetUser();

  useEffect(() => {
    console.log("Fetched User Data:", user);
    if (user === null) return;

    if (!user) {
      navigate("/login");
    } else if (user.subRole !== "Skill Specialist") {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading || user === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-screen w-full  bg-[#20010D] overflow-y-auto">
      <div className="bg-[#78120D] flex-shrink-0">
        <DashboardSidebar />
      </div>
      <main className="flex flex-col w-full h-full">
        <SkillSpecialistDashboardHeader />
        <div className="bg-[#20010D] flex-grow overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SkillSpecialistDashboard;

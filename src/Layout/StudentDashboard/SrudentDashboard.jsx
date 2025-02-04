import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import StudentDashboardHeader from "./StudentDashboardHeader";
import { useEffect, useState } from "react";
import GetUser from "../../Backend/GetUser";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = GetUser();

  useEffect(() => {
    if (user === null) return;

    if (!user) {
      navigate("/login");
    } else if (user.role !== "student") {
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
        <StudentDashboardHeader />
        <div className="bg-[#20010D] flex-grow overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

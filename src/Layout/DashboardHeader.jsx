import { Dropdown, Space } from "antd";
import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { FiLogOut, FiUser } from "react-icons/fi";
import { ImExit } from "react-icons/im";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      setIsAuthenticated(!!updatedToken);
    };

    // Add event listener for localStorage changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleProfile = () => {
    console.log("Navigating to profile");
    navigate("/dashboard/admin/profile");
  };

  const logout = () => {
    console.log("Logout function called");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    Swal.fire({
      icon: "success",
      title: "Signed out successfully",
      showConfirmButton: false,
      timer: 2000,
    });
    navigate("/login");
    setIsAuthenticated(false);
  };

  const handleMenuClick = ({ key }) => {
    console.log("Menu item clicked:", key);
    if (key === "profile") {
      handleProfile();
    } else if (key === "logout") {
      logout();
    }
  };

  const items = [
    {
      label: "Profile",
      key: "profile",
      icon: <FiUser />,
    },
    {
      label: "Logout",
      key: "logout",
      icon: <FiLogOut />,
    },
  ];

  const user = "Admin";

  return (
    <header className="z-10 bg-[#78120D] bg-opacity-90 mt-14 lg:mt-0">
      <div className="flex items-center justify-between gap-1 sm:gap-8 px-2 sm:px-4 py-2 md:py-3 lg:py-4 xl:py-5">
        <h1 className="heading2 text-white">Dashboard</h1>
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center space-x-1 sm:space-x-3 md:gap-x-6 notification-popover">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1 hover:text-primary"
            >
              <ImExit className="text-sm sm:text-lg text-white" />
              <p className="text-sm whitespace-pre sm:text-lg text-white">
                Live Site
              </p>
            </Link>

            {/* Dropdown Menu */}
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick, // Handle all clicks here
              }}
            >
              <a className="flex items-center">
                <Space>
                  {user && (
                    <span className="cursor-pointer hidden sm:block text-white">
                      {user}
                    </span>
                  )}
                  <BiUser className="cursor-pointer text-white" size={20} />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
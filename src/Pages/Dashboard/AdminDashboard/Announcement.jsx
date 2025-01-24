import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Button, Form, Input, message, Modal } from "antd";
import Swal from "sweetalert2";

const Announcement = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(12);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/all-announcement", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setProjects(result?.announcements || []);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        announcement: values.announcement,
      };
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Announcement added successfully");
        form.resetFields();
        fetchAnnouncement();
        setAddModalOpen(false);
      } else {
        const error = await response.json();
        message.error(error.message || "Error adding Announcement");
      }
    } catch (error) {
      message.error("Error adding Announcement");
      console.error("Error adding Announcement:", error);
    }
  };

  // Add modal
  const showAddModal = () => {
    setAddModalOpen(true);
  };

  const handleAddOk = () => {
    setAddModalOpen(false);
  };


  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:5000/announcement/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            message.success("Announcement deleted successfully");
            fetchAnnouncement(); // Refresh the announcement list
          } else {
            const error = await response.json();
            message.error(error.message || "Error deleting Announcement");
          }
        } catch (error) {
          message.error("Error deleting Announcement");
          console.error("Error deleting Announcement:", error);
        }
      }
    });
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return (
    <>
      <div className="flex justify-center py-8 text-white">
        <h2 className="heading2">All Announcement</h2>
      </div>

      <div className="w-full px-4 lg:px-10">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="heading2 text-white !font-semibold ">
            Total Announcement: {projects?.length}
          </h2>
          <Button
            onClick={() => showAddModal()}
            type="submit"
            className="bg-primary text-xl text-white px-6 py-6 rounded-lg"
          >
            Add New
          </Button>
        </div>
        <div className="overflow-x-auto text-white">
          <table className="table-auto w-full divide-y divide-gray-300 text-left text-sm lg:text-base">
            <thead className="bg-[#78120D] text-white">
              <tr>
                <th className="px-4 py-2">Sl No</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Announcement</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 description">
              {currentProjects.map((project, index) => (
                <tr key={project?._id}>
                  <td className="px-4 py-2">
                    {index + indexOfFirstProject + 1}
                  </td>
                  <td className="px-4 py-2">
                    {project?.title}
                  </td>
                  <td className="px-4 py-2">
                    {project?.announcement?.split(" ").length > 60 ? (
                      <Tooltip title={project.announcement}>
                        {project.announcement.split(" ").slice(0, 60).join(" ")}
                        ...
                      </Tooltip>
                    ) : (
                      project.announcement
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(project?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(project?._id)}>
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* add modal */}
      <Modal
        open={addModalOpen}
        onOk={handleAddOk}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
        className="custom-modal"
        bodyStyle={{
          backgroundColor: "#78120D",
          color: "white",
        }}
      >
        <div>
          <h2 className="heading2 mb-4 text-center">Add Announcement</h2>
          <div
            className="max-w-[1000px] task-form rounded-[16px] mx-auto my-4 md:my-8"
            style={{ backdropFilter: "blur(30px)" }}
          >
            <Form layout="vertical" onFinish={onFinish} form={form}>
              <Form.Item
                label="Title:"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input your Title",
                  },
                ]}
                className="text-white"
              >
                <Input
                  placeholder="Input your Title"
                  className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                />
              </Form.Item>
              <Form.Item
                label="Announcement:"
                name="announcement"
                rules={[
                  {
                    required: true,
                    message: "Please input your announcement!",
                  },
                ]}
                className="text-white"
              >
                <Input.TextArea
                  placeholder="Input your announcement"
                  className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                />
              </Form.Item>

              <button
                type="submit"
                className="common-button w-full !mt-5 !rounded-md"
              >
                Submit
              </button>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Announcement;

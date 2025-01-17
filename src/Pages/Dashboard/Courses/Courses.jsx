import { Button, Form, Input, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [handleOpenModal, setHandleOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUserShow, setSelectedUserShow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      message.error("Failed to fetch courses.");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);


  console.log("all course--------------", courses.map((course) => course._id));


  const handleDelete = (course) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${course?.name}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/courses/${course?._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.message === "Course deleted successfully") {
              message.success("Course deleted successfully");
              setCourses((prevUsers) =>
                prevUsers.filter((u) => u._id !== course?._id)
              );
            } else {
              message.error("An error occurred while deleting the Course.");
            }
          })
          .catch((error) => {
            console.error("Error deleting Course:", error);
            message.error("An error occurred while deleting the Course.");
          });
      }
    });
  };

  const showAddModal = (course) => {
    setSelectedUser(course);
    setAddModalOpen(true);
  };

  const handleAddOk = () => {
    setAddModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateModal = (id) => {
    console.log("id getting", id)
    const course = courses.find((c) => c._id === id);
    if (course) {
      setSelectedCourse(course);
      setHandleOpenModal(true);
    } else {
      console.error("Course not found for id:", id);
    }
  };


  const handleEditdOk = () => {
    setHandleOpenModal(false); // Close modal
    setSelectedCourse(null); // Reset selected course
  };

  const [imageFile, setImageFile] = useState(null);  // State for storing the file

  // const onFinish = async (values) => {
  //   try {
  //     if (!imageFile) {
  //       message.error("Please select an image file.");
  //       return;
  //     }

  //     // Prepare the form data
  //     const formData = new FormData();
  //     formData.append("course_name", values.course_name);
  //     formData.append("description", values.description);
  //     formData.append("thumbnail_image", imageFile); // Use the file stored in state
  //     formData.append("video", values.video);
  //     formData.append("course_price", parseFloat(values.course_price));

  //     const token = localStorage.getItem("token");
  //     const response = await fetch("http://localhost:5000/courses", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       message.success("Course added successfully");

  //       // Reset form and clear image state
  //       setImageFile(null);
  //       form.resetFields();

  //       // Close the modal
  //       setAddModalOpen(false); // Assuming setAddModalOpen is the state handler for the modal

  //       // Refresh the data
  //       fetchCourses(); // Call a function to refresh the courses list
  //     } else {
  //       const error = await response.json();
  //       message.error(error.message || "Error adding course");
  //     }
  //   } catch (error) {
  //     message.error("Error adding course");
  //     console.error("Error adding course:", error);
  //   }
  // };


  const onFinish = async (values) => {
    try {
      if (!imageFile) {
        message.error("Please select an image file.");
        return;
      }

      // Prepare the form data
      const formData = new FormData();
      formData.append("course_name", values.course_name);
      formData.append("description", values.description);
      formData.append("thumbnail_image", imageFile); // Use the file stored in state
      formData.append("video", values.video);
      formData.append("course_price", parseFloat(values.course_price));

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/courses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Course added successfully");

        // Reset form and clear image state
        setImageFile(null);
        form.resetFields();

        // Close the modal
        setAddModalOpen(false);

        // Refresh the data
        fetchCourses();
      } else {
        const error = await response.json();
        message.error(error.message || "Error adding course");
      }
    } catch (error) {
      message.error("Error adding course");
      console.error("Error adding course:", error);
    }
  };


  const onUpdateFinish = async (values) => {
    console.log("Values122222222", values)
    try {
      const formData = new FormData();
      formData.append("_id", values._id); // Add course ID for identification
      formData.append("course_name", values.course_name);
      formData.append("description", values.description);
      if (imageFile) {
        formData.append("thumbnail_image", imageFile); // Only include the new file if provided
      }
      formData.append("video", values.video);
      formData.append("course_price", parseFloat(values.course_price));

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/courses/${selectedCourse._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Course updated successfully");
        fetchCourses(); // Refresh course list
        setUpdateModalOpen(false); // Close modal
        setImageFile(null); // Clear image file state
        form.resetFields(); // Reset form fields
      } else {
        const error = await response.json();
        message.error(error.message || "Failed to update course");
      }
    } catch (error) {
      message.error("Error updating course");
      console.error("Error updating course:", error);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = courses.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(courses.length / usersPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex justify-center py-8 text-white">
        <h2 className="heading2">Manage All Courses</h2>
      </div>

      <div className="w-full px-4 lg:px-10">
        <div className="flex justify-between mb-4 items-center">
          <h2 className="heading2 text-white !font-semibold ">
            Total Courses: {courses.length}
          </h2>
          <Button onClick={() => showAddModal(courses)} type="submit" className="bg-primary text-xl text-white px-6 py-6 rounded-lg">Add Course</Button>
        </div>

        <div className="overflow-x-auto text-white description">
          <table className="table-auto w-full divide-y divide-gray-300 text-left text-sm lg:text-base">
            <thead className="bg-[#78120D] text-white">
              <tr>
                <th className="px-4 py-2">Sl No.</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Update</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course, index) => (
                <tr key={course._id}>
                  <td className="px-4 py-2">{index + indexOfFirstUser + 1}</td>
                  <td>
                    <img src={course?.thumbnail_image} className="w-10 h-10" />
                  </td>
                  <td className="px-4 py-2">{course?.course_name}</td>
                  <td className="px-4 py-2">{course?.description}</td>
                  <td className="px-4 py-2">{course?.course_price}</td>
                  {/* <td className="pl-8 py-2"> */}
                  {/* <button
                      onClick={() => handleUpdateModal(course)}
                      className="text-blue-600"
                    >
                      <FaRegEdit  className="text-xl text-primary" />
                    </button> */}
                  <td className="pl-8 py-2">
                    <button
                      onClick={() => handleUpdateModal(course._id)}
                      className="text-blue-600"
                    >
                      <FaRegEdit className="text-xl text-primary" />
                    </button>
                  </td>
                  {/* </td> */}

                  <td className="pl-8 py-2">
                    <button
                      onClick={() => handleDelete(course)}
                      className="btn btn-ghost btn-sm"
                    >
                      <FaTrashAlt className="text-red-800 text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1
                ? "bg-primary text-white"
                : "bg-gray-300 text-black"
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      {/* add Course */}
      <Modal
        visible={addModalOpen}
        onOk={handleAddOk}
        onCancel={() => setAddModalOpen(false)}
        footer={null}
        className="custom-modal"
        bodyStyle={{
          backgroundColor: "#78120D",
          color: "white",
        }}
      >
        {selectedUser && (
          <div>
            <h2 className="heading2 mb-4 text-center">Add Course1222</h2>
            <div
              className="max-w-[1000px] task-form rounded-[16px] mx-auto my-4 md:my-8"
              style={{ backdropFilter: "blur(30px)" }}
            >
              <Form
                layout="vertical"
                className="space-y-4 p-4"
                onFinish={onFinish}
                form={form}
              >
                <Form.Item
                  label="Course Name: "
                  name="course_name"
                  required
                  className="text-white"
                >
                  <Input
                    placeholder="Course Name"
                    type="text"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-gray-100 border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Task Coin: "
                  name="course_price"
                  required
                  className="text-white"
                >
                  <Input
                    placeholder="Input Task Coin"
                    type="text"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Course Description:"
                  name="description"
                  required
                  className="text-white"
                >
                  <Input.TextArea
                    placeholder="Input Course Description"
                    type="text"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Course Image:"
                  name="thumbnail_image"
                  className="text-white"
                  required
                >
                  <Input
                    type="file"
                    accept="image/*"
                    className="p-2 bg-[#78120D] text-white"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                      }
                    }}
                  />
                </Form.Item>


                <Form.Item
                  label="Video Link:"
                  name="video"
                  required
                  className="text-white"
                >
                  <Input
                    placeholder="Input Video Link"
                    type="url"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <button
                  type="submit"
                  className="common-button w-full !mt-10 !rounded-md"
                >
                  Submit
                </button>
              </Form>
            </div>
          </div>
        )}
      </Modal>

      {/* updated course */}
      <Modal
        visible={handleOpenModal} // State to control visibility
        onOk={handleEditdOk} // Handle modal OK action
        onCancel={() => setHandleOpenModal(false)} // Close modal
        footer={null}
        className="custom-modal"
        bodyStyle={{
          backgroundColor: "#78120D",
          color: "white",
        }}
      >
        {handleOpenModal && selectedCourse && (
          <div>
            <h2 className="heading2 mb-4 text-center">Update Course</h2>
            <div
              className="max-w-[1000px] task-form rounded-[16px] mx-auto my-4 md:my-8"
              style={{ backdropFilter: "blur(30px)" }}
            >
              <Form
                layout="vertical"
                className="space-y-4 p-4"
                onFinish={onUpdateFinish} // Update handler
                form={form}
                initialValues={{
                  _id: selectedCourse._id,
                  course_name: selectedCourse.course_name,
                  course_price: selectedCourse.course_price,
                  description: selectedCourse.description,
                  video: selectedCourse.video,
                  // thumbnail_image: selectedCourse.thumbnail_image
                }} // Pre-fill with selected course data
              >
                <Form.Item name="_id" label="Course ID:" className="text-white" hidden>
                  <Input
                    value={selectedCourse._id}
                    disabled
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-gray-100 border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Course Name:"
                  name="course_name"
                  required
                  className="text-white"
                >
                  <Input
                    placeholder="Course Name"
                    type="text"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-gray-100 border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Task Coin:"
                  name="course_price"
                  required
                  className="text-white"
                >
                  <Input
                    placeholder="Input Task Coin"
                    type="text"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Course Description:"
                  name="description"
                  required
                  className="text-white"
                >
                  <Input.TextArea
                    placeholder="Input Course Description"
                    type="text"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <Form.Item
                  label="Course Image:"
                  name="thumbnail_image"
                  className="text-white"
                >
                  <Input
                    placeholder="Upload Image"
                    type="file"
                    accept="image/*"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file); // Update state with new file
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label="Video Link:"
                  name="video"
                  required
                  className="text-white"
                >
                  <Input
                    placeholder="Input Video Link"
                    type="url"
                    className="p-2 md:p-3 lg:p-4 xl:p-5 bg-[#78120D] text-white border description focus:bg-[#78120D] hover:bg-[#78120D] focus:border-white hover:border-white placeholder-white"
                  />
                </Form.Item>

                <button
                  type="submit"
                  className="common-button w-full !mt-10 !rounded-md"
                >
                  Update
                </button>
              </Form>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
};
export default AllCourses;

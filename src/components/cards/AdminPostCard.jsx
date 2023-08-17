import PropTypes from "prop-types";
import { IMG_URL } from "../../const/const";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Popconfirm } from "antd";

const AdminPostCard = ({
  _id,
  photo,title,
  category,
  description,
  deletePostQuestion,
  edit,
}) => {
  return (
    <div key={_id} className="w-full border flex gap-5 ">
      <div
        key={_id}
        className="w-full border flex gap-5 sm:h-[300px] mt-5 max-[550px]:flex-col max-[550px]:w-3/4 mx-auto max-[450px]:w-full"
      >
        <div className="w-1/2 h-[200px] sm:h-[300px] md:w-[400px] max-[550px]:w-full">
          <img
            className="w-full h-full"
            src={IMG_URL + photo?._id + "." + photo?.name?.split(".")[1]}
            alt=""
          />
        </div>
        <div className="min-[550px]:w-1/2 max-[550px]:w-full max-[550px]:px-4 pb-3">
          <p className="text-[#592EA9] text-sm sm:text-base py-1 max-[550px]:py-0 max-[550px]:text-[10px]">
            {category?.name.toUpperCase()}
          </p>
          <h2 className=" cursor-pointer text-2xl sm:text-3xl text-[#232536] font-semibold pt-3 pb-7 max-[550px]:py-2">
            {title}
          </h2>
          <p className="textPost text-sm sm:text-base text-[#6D6E76]">
            {description}
          </p>
          <div className="flex w-full mt-5 text-white">
            <div
              onClick={() => edit(_id)}
              className="cursor-pointer border bg-green-500 text-2xl hover:bg-gray-400"
            >
              <EditOutlined style={{ padding: "8px 30px" }} />
            </div>

            <div className="cursor-pointer border text-xl hover:bg-gray-400 bg-red-600 sm:px-1 sm:py-2">
              <Popconfirm
                title="Title"
                description="Are you sure to delete this Post?"
                onConfirm={() => deletePostQuestion(_id)}
              >
                <DeleteOutlined style={{ padding: "6px 24px" }} />
              </Popconfirm>
            </div>
            <Link
              to={`/posts/${_id}`}
              className="cursor-pointer border items-center flex sm:py-2 sm:px-7 hover:bg-gray-400 bg-blue-600 py1 px-2"
            >
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

AdminPostCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  photo: PropTypes.object,
  _id: PropTypes.string,
  deletePostQuestion: PropTypes.func,
  edit: PropTypes.func,
  category: PropTypes.object,
};

export default AdminPostCard;

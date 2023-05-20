import { Avatar } from "antd";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // dynamic import
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons'



const CreatePostForm = ({ content, setContent, postSubmit, handleImage, uploading, image }) => {
  return (
    <div className="card">
      <div className="card-body pb-3">
        <form className="form-group">
          {/* React Quill editor */}
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(e) => setContent(e)}
            className="form-control"
            placeholder="Write something"
          />
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between text-muted ">
        <button onClick={postSubmit} className="btn btn-primary mt-1 btn-sm">
          Post
        </button>
        {/* image uploading */}
        <label>
          {
            image && image.url ? (<Avatar size={30} src={image.url} className="mt-1" />) : uploading ? (<LoadingOutlined className="mt-2" />) : (<CameraOutlined className="mt-2" />)
          }
            
          <input onChange={handleImage} type="file" accept="images/*" hidden/>
        </label>
      </div>
    </div>
  );
};
export default CreatePostForm;

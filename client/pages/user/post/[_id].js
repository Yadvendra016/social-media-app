import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import UserRoute from "./../../../components/routes/UserRoute";
import CreatePostForm from "../../../components/forms/CreatePostForm";
import { toast } from "react-toastify";

const EditPost = () => {
  //state
  const [post, setPost] = useState({});
  const router = useRouter();
  const [content, setContent] = useState("");
  const [image, setImage] = useState({}); // for image
  const [uploading, setUploading] = useState(false);
  // console.log(router);
  const _id = router.query._id;

  useEffect(() => {
    if (_id) fetchPost();
  }, [_id]);

  // fetch edit page [_id].js
  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      setPost(data);
      setContent(data.content);
      setImage(data.image);
    } catch (error) {
      console.log("Error while editPost client", error);
    }
  };
  // submit post after updation
  const postSubmit = async (e) => {
    e.preventDefault();
    // console.log("submit post to update", content, image);
    const { data } = await axios.put(`/update-post/${_id}`, { content, image });
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Post is update Succesfully");
      router.push("/user/dashboard");
    }
    try {
    } catch (error) {
      console.log("ERROR while postSumbit [_id].js => ", error);
    }
  };

  //update image
  const handleImage = async (e) => {
    const file = e.target.files[0]; // it could be the array
    let formData = new FormData();
    formData.append("image", file);
    // console.log([...formData]);

    setUploading(true);
    try {
      const { data } = await axios.post("/upload-image", formData);
      // console.log(data);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false);
    } catch (error) {
      console.log("Error while upload image => ", error);
      setUploading(false);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-image">
          <div className="col text-center">
            <h1>Update Post</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8 offset-md-2">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default EditPost;

import { useContext, useState,useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
// import CreatePostForm from "../../components/forms/CreatePostForm";
import CreatePostForm from "../../components/forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import {toast} from 'react-toastify'
import PostList from "../../components/cards/PostList";

const Home = () => {
  const [state, setState] = useContext(UserContext);
  //state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({}) // for image
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]); // posts

  const router = useRouter();
  // here when the page render then the post in render
  useEffect(() =>{
    if(state && state.token) fetchUserPost();
  },[state && state.token])

  // this function make a request to backend to fetch all the post of the user
  const fetchUserPost = async () =>{
    try {
      const {data} = await axios.get("/user-posts");
      // console.log("User post =>",data);
      setPosts(data);
    } catch (error) {
      console.log("ERROR while post-fetching Client => ", error);
    }
  }

  const postSubmit = async(e) => {
    e.preventDefault();
    // console.log("Post=> ,", content);
    try {
        const {data} = await axios.post('/create-post',{
            content, image
        });
        console.log("create post response => ",data);
        if(data.error){
          toast.error(data.error);
        }else{
          toast.success("Post created");
          setContent("");
          setImage({});
        }
    } catch (error) {
        console.log("Error from dashboard =>",error);
    }

  };

  // Function to upload image
  const handleImage = async (e) =>{
    const file = e.target.files[0]; // it could be the array
    let formData = new FormData();
    formData.append('image', file);
    // console.log([...formData]);
    
    setUploading(true);
    try {
      const {data} = await axios.post('/upload-image', formData);
      // console.log(data);
      setImage({
        url: data.url,
        public_id: data.public_id
      })
      setUploading(false);
    } catch (error) {
      console.log("Error while upload image => ",error);
      setUploading(false)
    }
  }

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row py-5 bg-default-image">
          <div className="col text-center">
            <h1>Newfeed</h1>
          </div>
        </div>

        <div className="row py-3">
          <div className="col-md-8">
            <CreatePostForm
              content={content}
              setContent={setContent}
              postSubmit={postSubmit}
              handleImage={handleImage}
              uploading={uploading}
              image={image}
            />
            <br />
            {/* pre tag to read json data nicely */}
            {/* <pre>{JSON.stringify(post, null, 4)}</pre> */}
            <PostList posts={posts}/>
          </div>
          <div className="col-md-4">sideBar</div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Home;

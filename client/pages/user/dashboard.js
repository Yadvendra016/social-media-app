import { useContext, useState,useEffect } from "react";
import { UserContext } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
// import CreatePostForm from "../../components/forms/CreatePostForm";
import CreatePostForm from "../../components/forms/CreatePostForm";
import { useRouter } from "next/router";
import axios from "axios";
import {toast} from 'react-toastify'
import PostList from "../../components/cards/PostList";
import People from "../../components/cards/people";
import Link from "next/link";


const Home = () => {
  const [state, setState] = useContext(UserContext);
  //state
  const [content, setContent] = useState("");
  const [image, setImage] = useState({}) // for image
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]); // posts
  const [people, setPeople] = useState([]); //people

  const router = useRouter();
  // here when the page render then the post in render and (later on) also user to follow
  useEffect(() =>{
    if(state && state.token){
      fetchUserPost(); // to fetch post
      findPeople();
    }
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

  // this function if for find people and show on the sidebar (as suggestion to follow)
  const findPeople = async (req,res) =>{ // this function execute in useEffect
    try {
      const {data} = await axios.get("/find-people");
      setPeople(data);

    } catch (error) {
      console.log("Error while findPeople Client =>",error);
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
          //while submit the post we can use fetchPost so that post shows without refreshing
          fetchUserPost();

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
  };

  // handle DETLETe post
  const handleDelete = async (post) =>{
    try {
      const answer = window.confirm("Are you sure?");
      if(!answer) return;
      const {data} = await axios.delete(`/delete-post/${post._id}`);
      toast.error("Post Deleted");

      fetchUserPost();

    } catch (error) {
      console.log("Error while Delete image => ",error);
    }
  }

  //what hapend when we click on the follow button
  const handleFollow = async(user) =>{
    // console.log("add this user to following list", user);
    try {
      const {data} = await axios.put('/user-follow',{_id: user._id}); // we send only id
      
      //update local Storage --> update user
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));

      //update context
      setState({...state, user: data});

      //update people state (helps when user follow it will remove from people array)
      let filtered = people.filter((p) => p._id !== user._id);
      setPeople(filtered);

      toast.success(`following ${user.name}`);
      //rerender the post in news feed
      fetchUserPost();


    } catch (error) {
      console.log("Error while handleFollow in dasboard.js => ",error);
    }
  }

  // Handle Like click(postlist)
  const handleLike = async (_id) =>{ // _id = postId
    // console.log("Like this post",_id);
    try {
      const {data} = await axios.put('/like-post', {_id});
      // console.log("liked: ",data);
      fetchUserPost(); // ones post updated then rerender the post
    } catch (error) {
      console.log("handleLIke =>", error);
    }
  }
  //Handle Unlike
  const handleUnlike = async (_id) =>{
    // console.log("Unlike this post",_id);
    try {
      const {data} = await axios.put('/unlike-post', {_id});
      console.log("unliked: ",data);
      fetchUserPost();
    } catch (error) {
      console.log("handleLIke =>", error);
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
            <PostList posts={posts} handleDelete={handleDelete} handleLike={handleLike} handleUnlike={handleUnlike} />
          </div>

          {/* Sidebar */}
          <div className="col-md-4">
            {/* following tag */}
            {state && state.user && state.user.following && <Link href={`/user/following`} className="h6 text-decoration-none">
                {state.user.following.length} Following
            </Link>}

           <People people={people} handleFollow={handleFollow} />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Home;

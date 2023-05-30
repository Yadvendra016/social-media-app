import { Avatar, List } from "antd";
import moment from "moment"; // for date formating
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import axios from "axios";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const Following = () => {
  const [state, setState] = useContext(UserContext);
  const [people, setPeople] = useState([]);

  const router = useRouter();

  //to fetch the people
  useEffect(() => {
    if (state && state.token) fetchFollowing();
  }, [state && state.token]);

  // fetch following user from backend
  const fetchFollowing = async (req, res) => {
    try {
      const { data } = await axios.get("/user-following");
      console.log("following => ", data);
      setPeople(data);

    } catch (error) {
      console.log("fetchFollowing =>", error);
    }
  };

  //function to show profile image if user uploaded
  const imageSource = (user) => {
    if (user.image) {
      return user.image.url;
    } else {
      return "/images/logo.png";
    }
  };


  // when user click on unfollow
  const handleUnfollow = async (user) => {
    try {
        const {data} = await axios.put('/user-unfollow', {_id: user._id});

         //update local Storage --> update user
      let auth = JSON.parse(localStorage.getItem("auth"));
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));

      //update context
      setState({...state, user: data});

       //update people state (helps when user follow it will remove from people array)
       let filtered = people.filter((p) => p._id !== user._id);
       setPeople(filtered);
       

    } catch (error) {
        console.log("handleUnfollow =>",error);
    }
  };

  return (
    <div className="row col-md-6 offset-md-3">
      {/* <pre>{JSON.stringify(people,null,4)}</pre> */}
      <List
        itemLayout="horizontal"
        dataSource={people}
        renderItem={(user) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={imageSource(user)} />}
              title={
                <div className="d-flex justify-content-between">
                  {user.username}{" "}
                  <span
                    onClick={() => handleUnfollow(user)}
                    className="text-primary pointer"
                  >
                    Unfollow
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <Link className="d-flex justify-content-center pt-5" href="/user/dashboard"> <RollbackOutlined /> </Link>
    </div>
  );
};
export default Following;

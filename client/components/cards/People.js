import { Avatar, List } from "antd";
import moment from "moment"; // for date formating
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../../context";
import { imageSource } from "../../functions";

const People = ({ people, handleFollow }) => {
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  //function to show profile image if user uploaded --> I put this in functions folder
//   const imageSource = (user) =>{
//   if(user.image){
//     return user.image.url;
//   }else{
//     return '/images/logo.png'
//   }
// }
  
  return (
    <>
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
                  {user.username} <span onClick={() => handleFollow(user)} className="text-primary pointer">Follow</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
export default People;

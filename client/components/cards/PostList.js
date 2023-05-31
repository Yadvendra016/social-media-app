import renderHTML from "react-render-html"; // to render html from react-quill editor
import moment from "moment";
import { useRouter } from "next/router";
import { Avatar } from "antd";
import { imageSource } from "../../functions"; // this is for profile photo show
import {
  HeartOutlined,
  HeartFilled,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
//context
import { useContext } from "react";
import { UserContext } from "../../context";

const PostList = ({ posts, handleDelete, handleLike, handleUnlike }) => {
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  return (
    <>
      {posts &&
        posts.map((post) => (
          <div key={post._id} className="card mb-5">
            <div className="card-header">
              {/* Profile Avatar */}
              {/* <Avatar size={40}>{post.postedBy.name[0]} </Avatar> */}
              <Avatar size={40} src={imageSource(post.postedBy)} />
              <span className="pt-2 mx-3">{post.postedBy.name}</span>
              <span className="pt-2 mx-3">
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className="card-body">
              <div>{renderHTML(post.content)}</div>
            </div>
            <div className="card-footer ">
              {post.image && (
                <div
                  style={{
                    backgroundImage: "url(" + post.image.url + ")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center ceter",
                    backgroundSize: "cover",
                    height: "300px",
                  }}
                ></div>
              )}
              {/* like and comment section */}
              <div className="d-flex pt-2">
                {post.like.includes(state.user._id) ? (
                  <HeartFilled
                    onClick={() => handleUnlike(post._id)}
                    className="text-danger pt-2 h5 px-2"
                  />
                ) : (
                  <HeartOutlined
                    onClick={() => handleLike(post._id)}
                    className="text-danger pt-2 h5 px-2"
                  />
                )}
                <div className="pt-2 ">{post.like.length} like</div>
                <CommentOutlined
                  className="text-danger pt-2 h5 px-2"
                  style={{ marginLeft: "2rem" }}
                />
                <div className="pt-2">4 comments</div>

                {state &&
                  state.user &&
                  state.user._id === post.postedBy._id && (
                    <>
                      <EditOutlined
                        onClick={() => router.push(`/user/post/${post._id}`)}
                        className="text-danger pt-2 h5 px-2 mx-auto"
                      />
                      <DeleteOutlined
                        onClick={() => handleDelete(post)}
                        className="text-danger pt-2 h5 px-2"
                      />
                    </>
                  )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default PostList;

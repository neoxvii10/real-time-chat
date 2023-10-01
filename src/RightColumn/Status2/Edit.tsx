import "./Edit.css";
import { TiTickOutline } from "react-icons/ti";
type UserProp = {
  name: string;
  id: string;
  avatar: string;
  chat: string;
  time: string;
  no_id: number;
};

type UserInfoProps = {
  userInfoProp: UserProp;
};

const EditInfor: React.FC<UserInfoProps> = ({ userInfoProp }) => {
  return (
    <div>
      <div className="status2-container">
        <div className="avatar">{userInfoProp.avatar}</div>
        <div className="name">{userInfoProp.name}</div>

        <form>
          <div className="edit-form-name-container">
            <div className="userbox firstname">
              <input type="text" name="fname" />
              <label>First name</label>
            </div>
            <div className="userbox lastname">
              <input type="text" name="lname" />
              <label>Last name</label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            <TiTickOutline size={24} />
          </button>
        </form>
        <button>Delete Contact</button>
      </div>
    </div>
  );
};

export default EditInfor;

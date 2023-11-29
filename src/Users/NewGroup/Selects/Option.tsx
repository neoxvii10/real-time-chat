import { MouseEvent, useState } from 'react';
import './Option.css';
import { TfiClose } from 'react-icons/tfi';

type User = {
  name: string,
  id: string,
  avatar: string,
  chat: string,
  time: string,
  no_id: number,
  deleteOption: (id: number) => void;
};

type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
  deleteOption: (id: number) => void;
}

const Option = (props: UserType) => {
  const handleDeleteOption = (event: MouseEvent<Element>) => {
    event.stopPropagation();
    props.deleteOption(props.id);
  };

  const [isHovered, setHover] = useState<boolean>(false);

  return (
    <div
      className="option"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isHovered ? (
        <div className="delete-icon-container">
          <TfiClose onClick={handleDeleteOption}
          size={20}
          className='delete-icon'/>
        </div>
      ) : (
        <div className="user-avatar">
          {/* <span>{props.avatar_url}</span> */}
          <img src={props.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
        </div>
      )}
      <div className="option-info">
        <h5>{props.fullname}</h5>
      </div>
    </div>
  );
};

export default Option;

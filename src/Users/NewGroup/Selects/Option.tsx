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

const Option = (props: User) => {
  const handleDeleteOption = (event: MouseEvent<Element>) => {
    event.stopPropagation();
    props.deleteOption(props.no_id);
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
            className='delete-icon' />
        </div>
      ) : (
        <div className="user-avatar">
          <span>{props.avatar}</span>
        </div>
      )}
      <div className="option-info">
        <h5>{props.name}</h5>
      </div>
    </div>
  );
};

export default Option;

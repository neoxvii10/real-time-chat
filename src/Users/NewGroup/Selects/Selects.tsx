import React from "react";
import { Dispatch, SetStateAction, useState, CSSProperties } from "react";
import { FaArrowRight } from 'react-icons/fa6';
import './Selects.css';
import GroupCreation from "./GroupCreation/GroupCreation";
import Checkbox from '@mui/material/Checkbox'

type UserProp = {
  name: string,
  id: string,
  avatar: string,
  chat: string,
  time: string,
  no_id: number,
}

type SelectsProps = {
  selectedOptions: UserProp[];
  setSelectedOptions: Dispatch<SetStateAction<UserProp[]>>;
  users: UserProp[];
};

const Selects: React.FC<SelectsProps> = ({ selectedOptions, setSelectedOptions, users }) => {
  const [isNewGroup, setNewGroup] = useState<boolean>(false);

  const [slideRight, setSlideRight] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(-480px)',
  });
  
  const handleNewGroupAnimation = () => {
      setNewGroup(!isNewGroup);
      console.log(isNewGroup);
      setSlideRight((slideRight) => ({
        ...slideRight,
        visibility: isNewGroup ? 'hidden' : 'visible' ,
        opacity: isNewGroup ? 0 : 1,
        transform: isNewGroup ? 'translateX(-480px)' : 'translateX(0px)',
      }));
  };

  const handleOptionClick = (selectedValue: UserProp) => {
    const option: UserProp = {
      name: selectedValue.name,
      id: selectedValue.id,
      avatar: selectedValue.avatar,
      chat: selectedValue.chat,
      time: selectedValue.time,
      no_id: selectedValue.no_id,
    };
    
    const isOptionSelected = selectedOptions.some(
      (selectedOption) => selectedOption.no_id === option.no_id
    );

    if (isOptionSelected) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.no_id !== option.no_id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
 
  return (
    <div className='select-container'>       
      <ul>
        {users.map((user) => (
          <li
            key={user.no_id}
            onClick={() => handleOptionClick(user)}
            className={
              selectedOptions.some((selectedOption) => selectedOption.no_id === user.no_id)
                ? "selected"
                : ""
            }
          >
            <Checkbox
              checked={selectedOptions.some((selectedOption) => selectedOption.no_id === user.no_id)}
              sx={{ 
                '& .MuiSvgIcon-root': { fontSize: 26 },
                color: 'var(--icon-color)',
                '&.Mui-checked': {
                  color: 'var(--checkbox-fill)',
                },
            }}
            />
            <div className="user">
              <div className="user-avatar">
                <span>
                  {user.avatar}
                </span>
              </div>
              <div className="user-labels">
                <h5>{user.name}</h5>
                <p>Last seen now</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="create-gr-btn-container" onClick={handleNewGroupAnimation}>
        <FaArrowRight className="create-gr-icon" size={22}/>
      </div>
      <GroupCreation
      slideRight={slideRight}
      handleNewGroupAnimation={handleNewGroupAnimation}
      selectedOptions={selectedOptions}
      />
    </div>
  );
}

export default Selects;

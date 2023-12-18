import React from "react";
import { Dispatch, SetStateAction, useState, CSSProperties } from "react";
import { FaArrowRight } from 'react-icons/fa6';
import './Selects.css';
import GroupCreation from "./GroupCreation/GroupCreation";
import Checkbox from '@mui/material/Checkbox'

type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
}

type SelectsProps = {
  selectedOptions: UserType[];
  setSelectedOptions: Dispatch<SetStateAction<UserType[]>>;
  slideRight: React.CSSProperties;
  setSlideRight: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  handleNewGroupAnimation: () => void;
  users: UserType[];
};

const Selects: React.FC<SelectsProps> = ({ selectedOptions, setSelectedOptions, slideRight, setSlideRight, handleNewGroupAnimation, users }) => {
  // const [isNewGroup, setNewGroup] = useState<boolean>(false);

  // const [slideRight, setSlideRight] = useState<CSSProperties>({
  //   visibility: 'hidden',
  //   opacity: 0,
  //   transform: 'translateX(-480px)',
  // });
  
  // const handleNewGroupAnimation = () => {
  //     setNewGroup(!isNewGroup);
  //     console.log(isNewGroup);
  //     setSlideRight((slideRight) => ({
  //       ...slideRight,
  //       visibility: isNewGroup ? 'hidden' : 'visible' ,
  //       opacity: isNewGroup ? 0 : 1,
  //       transform: isNewGroup ? 'translateX(-480px)' : 'translateX(0px)',
  //     }));
  // };

  const handleOptionClick = (selectedValue: UserType) => {
    const option: UserType = {
      id: selectedValue.id,
      avatar_url: selectedValue.avatar_url,
      username: selectedValue.username,
      first_name: selectedValue.first_name,
      last_name: selectedValue.last_name,
      fullname: selectedValue.fullname
    };

    const isOptionSelected = selectedOptions.some(
      (selectedOption) => selectedOption.id === option.id
    );

    if (isOptionSelected) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className='select-container'>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            onClick={() => handleOptionClick(user)}
            className={
              selectedOptions.some((selectedOption) => selectedOption.id === user.id)
                ? "selected"
                : ""
            }
          >
            <Checkbox
              checked={selectedOptions.some((selectedOption) => selectedOption.id === user.id)}
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
                  <img src={user.avatar_url || "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"} alt="avatar user" className='user-avatar-img'/>
              </div>
              <div className="user-labels">
                <h5>{user.fullname}</h5>
                <p>Last seen now</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="create-gr-btn-container" onClick={handleNewGroupAnimation}>
        <FaArrowRight className="create-gr-icon" size={22} />
      </div>
    </div>
  );
}

export default Selects;

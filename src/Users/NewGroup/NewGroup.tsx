import React from 'react';
import './NewGroup.css';
import { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6'
import Selects from './Selects/Selects'
import Option from '../NewGroup/Selects/Option'

type UserProp = {
  name: string,
  id: string,
  avatar: string,
  chat: string,
  time: string,
  no_id: number,
}

type UserType = {
  id: number,
  username: string,
  avatar_url: string,
  first_name: string,
  last_name: string,
  fullname: string
}



type NewGroupProp = {
  translateX: CSSProperties;
  handleSlideAnimation: Dispatch<SetStateAction<CSSProperties>>;
  users: UserProp[];
}

const NewGroup: React.FC<NewGroupProp> = ({ translateX, handleSlideAnimation, users }) => {
  const deleteOption = (no_id: number) => {
    setSelectedOptions(selectedOptions.filter((option) => option.no_id !== no_id));
  };

  const [selectedOptions, setSelectedOptions] = useState<UserProp[]>([]);

  const handleClose = () => {
    // Call the handleSlideAnimation function to close the new-group-container
    handleSlideAnimation(prevTranslateX => ({
      ...prevTranslateX,
      visibility: 'hidden',
      opacity: 0,
      transform: 'translateX(-480px)',
    }));
  };

  return (
    <div className="new-group-container" style={translateX}>
      <div className="new-group-header">
        <span className="new-gr-back-icon-container">
          <FaArrowLeft onClick={handleClose} size={22} className='new-gr-back-icon'/>
        </span>
        <h4>Add Member</h4>
      </div>
      <div className="select-values-container">
        <div className="select-values-content">
          {
            selectedOptions.map((singleOption) => 
              <Option 
                name={singleOption.name}
                id={singleOption.id}
                avatar={singleOption.avatar}
                chat={singleOption.chat}
                time={singleOption.time}
                no_id={singleOption.no_id}
                deleteOption={deleteOption}
              />
            )
          }
        </div>
      </div>
      <Selects
        selectedOptions = {selectedOptions}
        setSelectedOptions = {setSelectedOptions}
        users = {users}
      />
      
    </div>
  );
};

export default NewGroup;

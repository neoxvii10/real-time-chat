import React from 'react';
import './NewGroup.css';
import { CSSProperties, Dispatch, SetStateAction, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6'
import Selects from './Selects/Selects'
import Option from '../NewGroup/Selects/Option'
import GroupCreation from './Selects/GroupCreation/GroupCreation';

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
  users: UserType[];
}

const NewGroup: React.FC<NewGroupProp> = ({ translateX, handleSlideAnimation, users }) => {
  const deleteOption = (id: number) => {
    setSelectedOptions(selectedOptions.filter((option) => option.id !== id));
  };

  const [selectedOptions, setSelectedOptions] = useState<UserType[]>([]);

  const handleClose = () => {
    // Call the handleSlideAnimation function to close the new-group-container
    handleSlideAnimation(prevTranslateX => ({
      ...prevTranslateX,
      visibility: 'hidden',
      opacity: 0,
      transform: 'translateX(-480px)',
    }));
  };

  // group creation
  const [isNewGroup, setNewGroup] = useState<boolean>(false);

  const [slideRight, setSlideRight] = useState<CSSProperties>({
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateX(-480px)',
  });

  const handleNewGroupAnimation = () => {
    setNewGroup(!isNewGroup);
    setSlideRight((slideRight) => ({
      ...slideRight,
      visibility: isNewGroup ? 'hidden' : 'visible' ,
      opacity: isNewGroup ? 0 : 1,
      transform: isNewGroup ? 'translateX(-480px)' : 'translateX(0px)',
    }));
};

  return (
    <>
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
                  id={singleOption.id}
                  first_name={singleOption.first_name}
                  last_name={singleOption.last_name}
                  fullname={singleOption.fullname}
                  username={singleOption.username}
                  avatar_url={singleOption.avatar_url}
                  deleteOption={deleteOption}
                />
              )
            }
          </div>
        </div>
        <Selects
          slideRight={slideRight}
          setSlideRight={setSlideRight}
          handleNewGroupAnimation={handleNewGroupAnimation}
          selectedOptions = {selectedOptions}
          setSelectedOptions = {setSelectedOptions}
          users = {users}
        />
      </div>
      <GroupCreation
      slideRight={slideRight}
      handleNewGroupAnimation={handleNewGroupAnimation}
      handleCloseAddmember={handleClose}
      selectedOptions={selectedOptions}
      setSelectedOptions = {setSelectedOptions}
      />
    </>
  );
};

export default NewGroup;

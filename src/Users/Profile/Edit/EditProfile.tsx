import './EditProfile.css'
import { CSSProperties } from 'react';
import { TfiArrowLeft } from 'react-icons/tfi'
import { TbCameraPlus } from 'react-icons/tb'

type UserProp = {
    name: string;
    id: string;
    avatar: string;
    chat: string;
    time: string;
    no_id: number;
};

type Props = {
    userProp: UserProp;
    translateXForEdit: CSSProperties;
    setTranslateXForEdit:  React.Dispatch<React.SetStateAction<CSSProperties>>;
}

const EditProfile:React.FC<Props> = ({userProp, translateXForEdit, setTranslateXForEdit}) => {

    const handleSlideEdit = (event: React.MouseEvent<Element>) => {
        setTranslateXForEdit((translateXForEdit) => ({
            ...translateXForEdit,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(480px)',
        }));
    }

    return (
        <div className='edit-container' style={translateXForEdit}>
            <div className="edit-header">
                <span className='icon-container' onClick={e => handleSlideEdit(e)}>
                    <TfiArrowLeft size={22} className='header-icon' />
                </span>
                <div className="main-header">
                    <h3 className='title'>Edit profile</h3>
                </div>
            </div>
            <div className="wrapper">
                <div className="edit-content">
                    <div className="edit-profile">
                        <div className="avatar-editable">
                            <label className="avatar-lable" role="button" title="Edit your profile photo">
                                <input onInput={() => { }} className='input-image' type="file" accept="image/png, image/jpeg"></input>
                                <span className='camera-icon'><TbCameraPlus size={52} /></span>
                            </label>
                        </div>
                        <div className="input-group">
                            <input className='form-control' dir='auto' type="text" />
                            <label>First name</label>
                        </div>
                        <div className="input-group">
                            <input className='form-control' dir='auto' type="text" />
                            <label>Last name</label>
                        </div>
                        <div className="input-group">
                            <input className='form-control' dir='auto' type="text" />
                            <label>Bio</label>
                        </div>
                        <p className='edit-item-desription'>
                            Any details such as age, occupation or city <br/>
                            Example: 20 y.o developer from Ha Noi.
                        </p>
                    </div>
                    <div className="edit-username">
                        <h4>Username</h4>
                        <div className="input-group">
                            <input className='form-control' dir='auto' type="text" />
                            <label>Username</label>
                        </div>
                        <p className='edit-item-desription'>
                            You can use a-z, 0-9 and underscores. Minumum length is 5 characters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfile

import './EditProfile.css'
import Avatar from 'react-avatar-edit';
import { CSSProperties, useState, useEffect } from 'react';
import { TfiArrowLeft } from 'react-icons/tfi'
import { TbCameraPlus } from 'react-icons/tb'
import { AiOutlineClose } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa6'

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
    setTranslateXForEdit: React.Dispatch<React.SetStateAction<CSSProperties>>;
}

const EditProfile: React.FC<Props> = ({ userProp, translateXForEdit, setTranslateXForEdit }) => {
    const [disEditAvatar, setDisEditAvatar] = useState<boolean>(false);

    // fake: fetch data
    const [name, setName] = useState<string>("");
    const [fileAvatar, setFileAvatar] = useState<string>("");

    useEffect(() => {
        setName(userProp.name)
    }, []);
    //

    const handleSlideEdit = (event: React.MouseEvent<Element>) => {
        setTranslateXForEdit((translateXForEdit) => ({
            ...translateXForEdit,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(180px)',
        }));
    }

    // handle input or change in input tag (base)
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setName(event.target.value);
    }

    // handle avatar
    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setFileAvatar(URL.createObjectURL(img));
        }
    }

    const handleDisEditAvatar = () => {
        setDisEditAvatar(!disEditAvatar);
    }

    useEffect(() => {
        if(translateXForEdit.visibility === 'visible') {
            setDisEditAvatar(!disEditAvatar);
        }
    }, [fileAvatar])

    return (
        <>
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
                                    <input onChange={(e) => handleImage(e)} className='input-image' type="file" accept="image/png, image/jpeg"></input>
                                    <span className='camera-icon'><TbCameraPlus size={52} /></span>
                                </label>

                            </div>
                            <div className="input-group">
                                <input onChange={(e) => handleChange(e)} className='form-control' dir='auto' type="text" value={name} placeholder='Fist name' />
                                <label>First name</label>
                            </div>
                            <div className="input-group">
                                <input className='form-control' dir='auto' type="text" placeholder='Last name' />
                                <label className='label-input'>Last name</label>
                            </div>
                            <div className="input-group">
                                <input className='form-control' dir='auto' type="text" placeholder='Bio' />
                                <label>Bio</label>
                            </div>
                            <p className='edit-item-desription'>
                                Any details such as age, occupation or city <br />
                                Example: 20 y.o developer from Ha Noi.
                            </p>
                        </div>
                        <div className="edit-username">
                            <h4>Username</h4>
                            <div className="input-group">
                                <input className='form-control' dir='auto' type="text" placeholder='Username' />
                                <label>Username</label>
                            </div>
                            <p className='edit-item-desription'>
                                You can use a-z, 0-9 and underscores. Minimum length is 5 characters.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {disEditAvatar &&
                <div className="container-edit-avatar" >
                    <div onClick={handleDisEditAvatar} className="backdrop"></div>
                    <div className="wrap-edit">
                        <div className="header-edit">
                            <span onClick={handleDisEditAvatar} className='button-close'><AiOutlineClose size={22} /></span>
                            <div className='header-title'>Avatar</div>
                        </div>
                        <div className="content-edit">
                            <div className="avatar-crop">
                                <div className="wrap-image">
                                    <Avatar
                                        width={400}
                                        height={400}
                                        src={fileAvatar}
                                    />
                                    {/* <img src={"https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"} alt="avatar" className='image'/> */}
                                </div>
                                <div className="wrap-silder">
                                    {/* <input type="range" /> */}
                                </div>
                            </div>
                            <button className="confirm-button" type='button' title='crop image'>
                                <FaCheck size={24} />
                            </button>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default EditProfile

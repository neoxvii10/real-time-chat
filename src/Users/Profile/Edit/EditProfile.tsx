import './EditProfile.css'

import { CSSProperties, useState, useEffect } from 'react';
import { TfiArrowLeft } from 'react-icons/tfi'
import { TbCameraPlus } from 'react-icons/tb'
import { AiOutlineClose } from 'react-icons/ai'
import { FaCheck } from 'react-icons/fa6'

import ImageCrop from './ImageCrop/ImageCrop'
import UserProfileApi from '../../../Api/UserProfileApi';

type Props = {
    translateXForEdit: CSSProperties;
    setTranslateXForEdit: React.Dispatch<React.SetStateAction<CSSProperties>>;
}

type TypeUserProfile = {
    user?: {
        id?: number,
        first_name?: string,
        last_name?: string,
        fullname?: string,
        username?: string
    },
    bio?: string,
    avatar_url?: string,
    phone_number?: string,
    address?: string,
    online?: boolean
}

const EditProfile: React.FC<Props> = ({ translateXForEdit, setTranslateXForEdit }) => {

    // handle fetch data 
    const [data, setData] = useState<TypeUserProfile>({
        user: {
            id: 0,
            first_name: '',
            last_name: '',
            fullname: '',
            username: ''
        },
        bio: '',
        avatar_url: '',
        phone_number: '',
        address: '',
        online: true
    });

    useEffect(() => {
        const fetchData = async () => {

            try {
                const response = await UserProfileApi.getProfile();
                setData(response?.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
    }, [translateXForEdit])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        if (name === 'first_name' || name === 'last_name') {
            setData({
                ...data,
                user: {
                    ...data.user,
                    [name]: value
                }
            })
        } else {
            setData({
                ...data,
                [name]: value
            })
        }

        // visible button submit
        handleVisibleBtn(true);
    }

    // handle submit
    const handleSubmitData = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if(isCropped) {
            await handleSubmitAvatar(event);
        }

        const formData = {
            "first_name": data.user?.first_name,
            "last_name": data.user?.last_name,
            "bio": data.bio,
            "avatar_url": data.avatar_url,
            "phone_number": data.phone_number,
            "address": data.address,
            "online": true
        }

        const response = await UserProfileApi.putProfile(formData);
        console.log("update profile user:", response);

        handleVisibleBtn(false);
    }

    // handle submit blob 
    const handleSubmitAvatar = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (croppedBlob) {
            const fileAvatar = new File([croppedBlob], "my_avatar.jpg", { type: "image/jpeg", lastModified: new Date().getTime() })
            const formData = new FormData();
            formData.append('file', fileAvatar);
            try {
                const response = await UserProfileApi.putAvatar(formData);
                setData({
                    ...data,
                    avatar_url: response.data.avatar_url
                })
                console.log("update avatar", response);

                // 
                setIsCropped(false);
            } catch (error) {
                console.log(error)
            }
        }
    }

    // handle image and slide

    const [disEditAvatar, setDisEditAvatar] = useState<boolean>(false);

    const [selectedImage, setSelectedImage] = useState<string>("");

    const [croppedImage, setCroppedImage] = useState<string>();
    const [croppedBlob, setCroppedBlob] = useState<Blob>();
    const [isCropped, setIsCropped] = useState<boolean>(false);

    const handleCropImage = ({ blob, url }: { blob: Blob; url: string }) => {
        setCroppedBlob(blob);
        setCroppedImage(url);
        setIsCropped(true);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setCroppedImage('');
            setIsCropped(false);
        }

        setDisEditAvatar(true);
        handleVisibleBtn(true);
    };

    //
    const handleSlideEdit = (event: React.MouseEvent<Element>) => {
        setTranslateXForEdit((translateXForEdit) => ({
            ...translateXForEdit,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(-480px)',
        }));
    }

    //

    const [hideBtnSubmit, setHideBtnSubmit] = useState<CSSProperties>({
        visibility: 'hidden',
        bottom: '-4rem'
    });

    const handleVisibleBtn = (visible: boolean) => {
        if (visible) {
            setHideBtnSubmit({
                ...hideBtnSubmit,
                visibility: 'visible',
                bottom: '1rem'
            })
        } else {
            setHideBtnSubmit({
                ...hideBtnSubmit,
                visibility: 'hidden',
                bottom: '-4rem'
            })
        }
    }

    // handle visible edit avatar
    const handleHiddenEditAvatar = () => {
        setDisEditAvatar(false);
        setSelectedImage("");
    }

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
                            <div className="file-container selected-image-container" >
                                <label htmlFor="file-input" className="change-image-button">
                                    <TbCameraPlus className="add-photo-icon" size={50} />
                                </label>

                                <div className="image-container">
                                    {isCropped && croppedImage && (
                                        <img className="cropped-img" src={croppedImage} alt="Cropped Image" />
                                    )}
                                    {!isCropped && (
                                        <img className="cropped-img" src={data.avatar_url} alt="Image" />
                                    )}
                                </div>

                                <input
                                    type="file"
                                    id="file-input"
                                    name="photo"
                                    accept="image/png, image/jpeg"
                                    onChange={handleImageChange}
                                    style={{ opacity: 0 }}
                                    title=""
                                />
                            </div>
                            {/*  */}
                            {/* <button onClick={handleSubmitAvatar}>test submit file</button> */}
                            {/*  */}
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="text" name='first_name' value={data.user?.first_name} placeholder='Fist name' />
                                <label>First name</label>
                            </div>
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="text" name='last_name' value={data.user?.last_name} placeholder='Last name' />
                                <label className='label-input'>Last name</label>
                            </div>
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="text" name='address' value={data.address} placeholder='Last name' />
                                <label className='label-input'>Address</label>
                            </div>
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="text" name='bio' value={data.bio} placeholder='Bio' />
                                <label>Bio</label>
                            </div>
                            <p className='edit-item-desription'>
                                Any details such as age, occupation or city <br />
                                Example: 20 y.o developer from Ha Noi.
                            </p>
                        </div>
                        <div className="edit-username">
                            <h4>Phone</h4>
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="text" name='phone_number' value={data.phone_number} placeholder='Username' />
                                <label>Phone</label>
                            </div>
                            <p className='edit-item-desription'>
                                Enter your phone
                            </p>
                        </div>
                    </div>
                    <button style={hideBtnSubmit} className='btn-submit-edit' onClick={handleSubmitData}>
                        <FaCheck size={24} />
                    </button>
                </div>
            </div>

            {disEditAvatar &&
                <div className="container-edit-avatar" >
                    <div onClick={handleHiddenEditAvatar} className="backdrop"></div>
                    <div className="wrap-edit">
                        <div className="header-edit">
                            <span onClick={handleHiddenEditAvatar} className='button-close'><AiOutlineClose size={22} /></span>
                            <div className='header-title'>Avatar</div>
                        </div>
                        <div className="content-edit">
                            <div className="avatar-crop">
                                <ImageCrop setDisEditAvatar={setDisEditAvatar} selectedImage={selectedImage} onCropImage={handleCropImage} />
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default EditProfile

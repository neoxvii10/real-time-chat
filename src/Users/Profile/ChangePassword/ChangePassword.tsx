import React from 'react'
import './ChangePassword.css'
import { TfiArrowLeft } from 'react-icons/tfi'
import { FaCheck } from 'react-icons/fa6'
import { CSSProperties, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserApi from '../../../Api/UserApi';

type Props = {
    translateXForChangePassword: CSSProperties;
    setTranslateXForChangePassword: React.Dispatch<React.SetStateAction<CSSProperties>>;
}

type ChangePasswordType = {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePassword: React.FC<Props> = ({translateXForChangePassword, setTranslateXForChangePassword}) => {

    const handleSlideEdit = (event: React.MouseEvent<Element>) => {
        setTranslateXForChangePassword((translateXForChangePassword) => ({
            ...translateXForChangePassword,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(-480px)',
        }));
    }

    // handle input and submit change password
    const navigate = useNavigate();

    const [password, setPassword] = useState<ChangePasswordType>({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        if(name) {
            setPassword({...password, [name]: value})
        }

        handleVisibleBtn(true)
    }

    const handleSubmitChangePassword = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if(password.newPassword !== password.confirmNewPassword) {
            alert("New pass word and confirm not same");
            setPassword({
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            })
            return;
        }
        const formData = {
            oldPassword: password.oldPassword,
            newPassword: password.newPassword
        }
        console.log(formData)
        try {
            const response = await UserApi.changePassword(formData);
            alert("Change password successfully. Logout")
            await localStorage.removeItem('accessToken');
            await localStorage.removeItem('user');
            navigate('/signin');
        } catch (error) {
            alert("Old password not match");
        }
    }

    // handle btn submit
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
    
    return (
        <div className='edit-container' style={translateXForChangePassword}>
                <div className="edit-header">
                    <span className='icon-container' onClick={e => handleSlideEdit(e)}>
                        <TfiArrowLeft size={22} className='header-icon' />
                    </span>
                    <div className="main-header">
                        <h3 className='title'>Change password</h3>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="edit-content">
                        <div className="edit-profile">
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="password" value={password.oldPassword} name='oldPassword' placeholder='Old password' />
                                <label>Old password</label>
                            </div>
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="password" value={password.newPassword} name='newPassword' placeholder='New password' />
                                <label className='label-input'>New password</label>
                            </div>
                            <div className="input-group">
                                <input onChange={handleInputChange} className='form-control' dir='auto' type="password" value={password.confirmNewPassword} name='confirmNewPassword'  placeholder='Confirm new password' />
                                <label className='label-input'>Confirm new password</label>
                            </div>
                        </div>
                    </div>
                    <button style={hideBtnSubmit} className='btn-submit-edit' onClick={handleSubmitChangePassword}>
                        <FaCheck size={24} />
                    </button>
                </div>
            </div>
    )
}

export default ChangePassword

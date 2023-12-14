import React from 'react'
import './ChangeEmail.css'
import { TfiArrowLeft } from 'react-icons/tfi'
import { FaCheck } from 'react-icons/fa6'
import { CSSProperties, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerifyEmail from './VerifyEmail/VerifyEmail';

import UserApi from '../../../Api/UserApi';


type Props = {
    translateXForChangeEmail: CSSProperties;
    setTranslateXForChangeEmail: React.Dispatch<React.SetStateAction<CSSProperties>>;
}

const ChangeEmail: React.FC<Props> = ({ translateXForChangeEmail, setTranslateXForChangeEmail }) => {
    const handleSlideChangeEmail = (event: React.MouseEvent<Element>) => {
        setTranslateXForChangeEmail((translateXForChangeEmail) => ({
            ...translateXForChangeEmail,
            visibility: 'hidden',
            opacity: 0,
            transform: 'translateX(-480px)',
        }));
    }

    const validateEmail = (email: string) => {
        return String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
      };
    // handle input change

    const [newEmail, setNewEmail] = useState<string>('');

    const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value)

        handleVisibleBtn(true)
    }

    const handleSubmitChangeEmail = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if(!validateEmail(newEmail)) {
            alert("Email incorrect!")
            return
        }

        const formData = {
            newEmail: newEmail
        }
        try {
            const response = await UserApi.changeEmail(formData)
            console.log(response)
            handleSlideVerifyEmail()
        } catch (error) {
            alert("Have some errors")
        }
    }

    // slide verify email
    const [translateXForVerifyEmail, setTranslateXForVerifyEmail] = useState<CSSProperties>({
        visibility: 'hidden',
        opacity: 0,
        transform: 'translateX(-480px)',
    })

    const handleSlideVerifyEmail = () => {
        setTranslateXForVerifyEmail((translateXForVerifyEmail) => ({
            ...translateXForVerifyEmail,
            visibility: 'visible',
            opacity: 1,
            transform: 'translateX(0px)',
        }));
    }

    // visible btn submit
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
        <>
            <div className='edit-container' style={translateXForChangeEmail}>
                <div className="edit-header">
                    <span className='icon-container' onClick={e => handleSlideChangeEmail(e)}>
                        <TfiArrowLeft size={22} className='header-icon' />
                    </span>
                    <div className="main-header">
                        <h3 className='title'>Change email</h3>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="edit-content">
                        <div className="edit-profile">
                            <div className="input-group">
                                <input onChange={handleInputChangeEmail} className='form-control' dir='auto' type="email" value={newEmail} name='newEmail' placeholder='New email' />
                                <label>New email</label>
                            </div>
                        </div>
                    </div>
                    <button style={hideBtnSubmit} className='btn-submit-edit' onClick={handleSubmitChangeEmail}>
                        <FaCheck size={24} />
                    </button>
                </div>
            </div>
            <VerifyEmail translateXForVerifyEmail={translateXForVerifyEmail} setTranslateXForVerifyEmail={setTranslateXForVerifyEmail} />
        </>
    )
}

export default ChangeEmail

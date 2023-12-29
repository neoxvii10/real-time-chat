import React from 'react'
import { TfiArrowLeft } from 'react-icons/tfi'
import { FaCheck } from 'react-icons/fa6'
import { CSSProperties, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import UserApi from '../../../../Api/UserApi';

type Props = {
  translateXForVerifyEmail: CSSProperties;
  setTranslateXForVerifyEmail: React.Dispatch<React.SetStateAction<CSSProperties>>;
}

const VerifyEmail: React.FC<Props> = ({translateXForVerifyEmail, setTranslateXForVerifyEmail}) => {
  const handleSlidrVerifyEmail = (event: React.MouseEvent<Element>) => {
    setTranslateXForVerifyEmail((translateXForVerifyEmail) => ({
      ...translateXForVerifyEmail,
      visibility: 'hidden',
      opacity: 0,
      transform: 'translateX(-480px)',
    }));
  }
  // handle input change
  const navigate = useNavigate();

  const [verifyCode, setVerifyCode] = useState<string>('');

  const handleInpurVerifyEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyCode(event.target.value)

    handleVisibleBtn(true)
  }

  const handleSubmitVerifyCode = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    const formData = {
      verification_code: verifyCode
    }
    try {
        const response = await UserApi.verifyChangeEmail(formData)
        alert("Change email successfully. Logout");

        await localStorage.removeItem('accessToken');
        await localStorage.removeItem('user');
        navigate('/signin');

        console.log(response)
    } catch (error) {
        alert("Code not match")
    }
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
    <div className='edit-container' style={translateXForVerifyEmail}>
      <div className="edit-header">
        <span className='icon-container' onClick={e => handleSlidrVerifyEmail(e)}>
          <TfiArrowLeft size={22} className='header-icon' />
        </span>
        <div className="main-header">
          <h3 className='title'>Verify email</h3>
        </div>
      </div>
      <div className="wrapper">
        <div className="edit-content">
          <div className="edit-profile">
            <div className="input-group">
              <input onChange={handleInpurVerifyEmail} className='form-control' dir='auto' type="text" value={verifyCode} name='verifyCode' placeholder='New email' />
              <label>Enter code (sent to your new email) </label>
            </div>
          </div>
        </div>
        <button style={hideBtnSubmit} className='btn-submit-edit' onClick={handleSubmitVerifyCode}>
          <FaCheck size={24} />
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail

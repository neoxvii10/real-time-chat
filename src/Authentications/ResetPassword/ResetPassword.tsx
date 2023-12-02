import React, { useState } from 'react'
import { BsTelegram } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UserApi from '../../Api/UserApi';

type ResetPasswordType = {
    password: string;
    token: string;
}

type ErrorType = {
    response?: {
        data?: string,
        status?: number
    }
}

const ResetPassword = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<ResetPasswordType>({
        password: '',
        token: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if(name) {
            setData({
                ...data,
                [name]: value,
            });
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            password: data.password,
            token: data.token
        };

        try {
            const response = await UserApi.resetPassword(formData);
            console.log("response", response, formData.password);
            navigate("/signin");
        } catch (error) {
            console.log('error', error);
            // alert(error.response?.data.detail)
        }
    }

    return (
        <section className="signin-form-container">
            <div className="logo-icon-container">
                <BsTelegram size={150} style={{ color: "var(--icon-color-active)" }} />
            </div>
            <h4 className='title-heading'>Change Password Form</h4>
            <form action="" className='signin-contents' onSubmit={handleSubmit}>
                <div className="input-group">
                    <input onChange={handleInputChange} className='form-control' dir='auto' value={data.password}  type="password" name='password' placeholder='' />
                    <label>New Password</label>
                </div>
                <div className="input-group">
                    <input onChange={handleInputChange} className='form-control' dir='auto' value={data.token} type="text" name='token' placeholder='' />
                    <label>Token confirm( has been sent to your email)</label>
                </div>
                <button className='submit-btn signin' type='submit'>Change Password</button>
            </form>
            <span><Link to="/reset-password/email">Back to input email</Link></span>
        </section>
    )
}

export default ResetPassword

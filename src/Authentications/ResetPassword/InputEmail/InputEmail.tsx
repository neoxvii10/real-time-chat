import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { BsTelegram } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';
import UserApi from '../../../Api/UserApi';

const InputEmail = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
            email: email
        }

        try {
            const response = await UserApi.requestResetPassword(formData);
            console.log(response);
            navigate("/reset-password");
        } catch (error) {
            console.log(error);
            alert("We couldn't find an account associated with that email. Please try a different e-mail address.");
        }
    }

    return (
        <section className="signin-form-container">
            <div className="logo-icon-container">
                <BsTelegram size={150} style={{ color: "var(--icon-color-active)" }} />
            </div>
            <h4 className='title-heading'>Reset Password Form</h4>
            <form action="" className='signin-contents' onSubmit={handleSubmit}>
                <div className="input-group">
                    <input onChange={handleInputChange} className='form-control' dir='auto' value={email} type="email" name='email' placeholder='' />
                    <label>Your email</label>
                </div>
                <button className='submit-form-btn signin' type='submit'>Submit</button>
            </form>
            <span><Link to="/signin">Back to signin</Link></span>
        </section>
    )
}

export default InputEmail

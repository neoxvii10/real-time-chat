import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Redirect.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type VerifyProp = {
  username: string;
  verification_code: string;
};

const MediumPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<VerifyProp>({
    username: `${username}`,
    verification_code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      username: `${username}`,
      verification_code: (event.target as any).verification_code.value,
    };

    try {
      toast.success('Verification successful. Redirecting...', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2500,
        hideProgressBar: true,
        pauseOnHover: true,
        closeOnClick: false,
        theme: "dark",
      });

      setTimeout(async () => {
        const response = await axios.post('http://112.137.129.158:5002/api/user/verify/', formData);
        console.log(response.data);
        navigate('/signin');
      }, 2000);
    } catch (error) {
      toast.error('Wrong Verification Code!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2500,
        hideProgressBar: true,
        pauseOnHover: true,
        closeOnClick: false,
        theme: "dark",
      });
      console.error('Error sending data:', error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form action="" className='verify-contents' onSubmit={handleSubmit}>
        <h2>Medium Page</h2>
        <p>Username: {username}</p>
        <input
          id="verification_code"
          name="verification_code"
          value={data.verification_code}
          onChange={handleChange}
          type='text'
          placeholder='Verification Code'
          required
        />
        <button className='verify-btn' type="submit">Submit</button>
      </form>
    </div>
  );
}

export default MediumPage;

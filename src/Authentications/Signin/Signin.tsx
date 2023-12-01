import { useState } from 'react';
import { BsTelegram } from 'react-icons/bs'
import Checkbox from '@mui/material/Checkbox'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import './Signin.css';
import UserApi from '../../Api/UserApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type SigninProp = {
  username: string;
  password: string;
};

type ApiResponse = {
  message?: string;
  data?: {
    refresh?: string,
    access?: string
  }
};

export default function CountrySelect() {
  const navigate = useNavigate();

  const [data, setData] = useState<SigninProp>({
    username: '',
    password: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name) {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      username: data.username,
      password: data.password,
    };

    try {
      setTimeout(async () => {
        const response: ApiResponse = await UserApi.signin(formData);

        if (response.message === 'Login successfully') {
          localStorage.setItem('user', JSON.stringify(data));
          localStorage.setItem('accessToken', JSON.stringify(response?.data?.access))
          toast.success('Login successful. Redirecting...', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2500,
            hideProgressBar: true,
            pauseOnHover: true,
            closeOnClick: false,
            theme: "dark",
          });
          navigate('/');
        } else if (response.message === 'Password not match') {
          toast.error('Invalid username or password!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2500,
            hideProgressBar: true,
            pauseOnHover: true,
            closeOnClick: false,
            theme: "dark",
          });
        }
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error('Invalid username or password!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2500,
        hideProgressBar: true,
        pauseOnHover: true,
        closeOnClick: false,
        theme: "dark",
      });
    }

    setData({
      username: '',
      password: '',
    });
  };


  return (
    <section className="signin-form-container">
      <ToastContainer />
      <div className="logo-icon-container">
        <BsTelegram size={150} style={{ color: "var(--icon-color-active)" }} />
      </div>
      <h4 className='title-heading'>Signin Form</h4>
      <form action="" className='signin-contents' onSubmit={handleSubmit}>
        <div className="input-group">
          <input onChange={handleInputChange} value={data.username} className='form-control' dir='auto' type="text" name='username' placeholder='' />
          <label>Username or email</label>
        </div>
        <div className="input-group">
          <input onChange={handleInputChange} value={data.password} className='form-control' dir='auto' type="password" name='password' placeholder='' />
          <label>Password</label>
        </div>
        <button className='submit-btn signin' type='submit'>Submit</button>
      </form>
      <div className="label-utils">
        <span>
          <Checkbox
            sx={{
              '& .MuiSvgIcon-root': { fontSize: 26 },
              color: 'var(--icon-color)',
              '&.Mui-checked': {
                color: 'var(--checkbox-fill)',
              },
              margin: 0,
              padding: 0,
            }}
          /> Keep me signed in</span>
        <a href="">Forgot password?</a>
      </div>
      <span>Dont't have an account? <Link to="/signup">Signup</Link></span>
    </section>
  );
}
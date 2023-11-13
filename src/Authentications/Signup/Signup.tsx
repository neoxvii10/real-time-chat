import { BsTelegram } from 'react-icons/bs'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

import './Signup.css';

type UserSignupProp = {
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  email: string;
};

export default function CountrySelect() {
  const [data, setData] = useState<UserSignupProp>({
    first_name: "",
    last_name: "",
    password: "",
    username: "",
    email: "",
  });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setData(prevData => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      first_name: (event.target as any).firstname.value,
      last_name: (event.target as any).lastname.value,
      password: (event.target as any).password.value,
      username: (event.target as any).username.value,
      email: (event.target as any).email.value,
    };

    try {
      const response = await axios.post('http://16.162.46.190/api/user/signup/', formData);
      console.log(response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: 'var(--border-on-click)',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#2f2f2f',
      },
      '&:hover fieldset': {
        borderColor: 'var(--border-on-click)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--border-on-click)',
      },
      borderRadius: '10px',
    },
    '& .MuiInputLabel-root': {
      color: '#9e9e9e',
    },
    '&:hover .MuiInputLabel-root': {
      color: 'var(--border-on-click)',
    },
    '&.Mui-focused .MuiInputLabel-root': {
      color: 'var(--border-on-click)',
    },
    '& .MuiOutlinedInput-input': {
      color: 'var(--font-color)',
    },
    
    marginTop: '1.4rem',
  });

  return (
    <section className="signup-form-container">
      <div className="logo-icon-container">
        <BsTelegram size={150} style={{color: "var(--icon-color-active)"}}/>
      </div>
      <h4>Signup Form</h4>
      <form action="" className='signup-contents' onSubmit={handleSubmit}>
        <input
        // label="First Name"
        id="firstname"
        name="first_name"
        value = {data.first_name}
        onChange={handleChange}
        />
        <input
        // label="Last Name"
        id="lastname"
        name="last_name"
        value={data.last_name}
        onChange={handleChange}
        />
        
        <input
        // label="Email"
        id="email"
        name="email"
        value={data.email}
        onChange={handleChange}
        />
        <input
        // label="Username"
        id="username"
        name="username"
        value={data.username}
        onChange={handleChange}
        />
        <input
        // label="Password"
        id="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        />
        <input
        // label="Confirm Password"
        id="cfpassword"
        />
        <button className='submit-btn signup' type="submit">Submit</button>
      </form>
      <span>Already have an account? <Link to="/signin">Signin</Link></span>
    </section>
  );
}

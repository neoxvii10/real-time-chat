import { BsTelegram } from 'react-icons/bs'
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";

import './Signin.css';

export default function CountrySelect() {
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
    <section className="signin-form-container">
      <div className="logo-icon-container">
        <BsTelegram size={150} style={{color: "var(--icon-color-active)"}}/>
      </div>
      <h4>Signin Form</h4>
      <form action="" className='signin-contents'>
        <CssTextField
        label="Username or Email"
        id="email"
        />
        <CssTextField
        label="Password"
        id="password"
        type='password'
        />
        <button className='submit-btn signin'>Submit</button>
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
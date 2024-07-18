import React, { useState, useEffect } from 'react';
import axios from "axios";
import './regsiter.css'; // Corrected CSS file name

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [type,settype]=useState('')
  // const [password, setPassword] = useState('');
  // const [confirmpassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [registering, setRegistering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // const validatePassword = (password) => {
  //   return password.length >= 6;
  // };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTypeChange = (e) => {
    settype(e.target.value);
  };

  // const handlePasswordChange = (e) => {
  //   setPassword(e.target.value);
  // };

  // const handleConfirmPasswordChange = (e) => {
  //   setConfirmPassword(e.target.value);
  // };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setPreviewUrl(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('input')) {
      setErrors({});
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);

    const newErrors = {};

    if (!username) {
      newErrors.username = 'Name is required';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    
    if (!type) {
      newErrors.type = 'Type  is required';
    }

    // if (!password) {
    //   newErrors.password = 'Password is required';
    // } else if (!validatePassword(password)) {
    //   newErrors.password = 'Password must be at least 6 characters long';
    // }

    // if (!confirmpassword) {
    //   newErrors.confirmpassword = 'Confirm Password is required';
    // } else if (password !== confirmpassword) {
    //   newErrors.passwordMismatch = 'Passwords do not match';
    // }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {

      const HOSTED_SERVER_URL = 'http://localhost:443';

      try {
        const token = localStorage.getItem('accessTocken');
        const response = await axios.post(`${HOSTED_SERVER_URL}/users`, {
          username,
          email,
          type,
          // password,
          // confirmpassword,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response && response.data && response.data.statusCode) {
          alert('Form Registered successfully');
          console.log('Form Registered successfully');
          setUsername('');
          setEmail('');
          settype('')
          // setPassword('');
          // setConfirmPassword('');
        } else {
          console.error('Form submission failed');
        }
      } catch (error) {
        console.error('Error during form Submission:', error.response ? error.response.data.message : error.message);
      }
    }

    setRegistering(false);
  };

  // useEffect(() => {
  //   const fileInput = document.getElementById('profile-image-upload');
  //   if (fileInput) {
  //     fileInput.addEventListener('change', handleFileChange);
  //     return () => {
  //       fileInput.removeEventListener('change', handleFileChange);
  //     };
  //   }
  // }, []);

  return (
    <>
      <div className='bgReg'> {/* Corrected CSS class name */}
        <form className='form2' onSubmit={handleSubmit}>
          <h1 className="bebas-neue-regular">Registration</h1>
          {/* <div className="profile-pic">
            <label htmlFor="profile-image-upload">Upload Profile Picture:</label>
            <img
              alt="User Pic"
              src={previewUrl || "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png"}
              id="profile-image1"
              height={200}
            />
            <input
              id="profile-image-upload"
              className="hidden"
              type="file"
            />
            <div style={{ color: "#999" }}></div>
          </div> */}
          <div>
            <label>Name:</label>
            <input className='regsiterinput' placeholder='Enter Name' type="text" value={username} onChange={handleUsernameChange} />
            {errors.username && <p className='error-message'>{errors.username}</p>}
          </div>
          <div>
            <label>Email:</label>
            <input className='regsiterinput' placeholder='Enter Email' type="email" value={email} onChange={handleEmailChange} />
            {errors.email && <p className='error-message'>{errors.email}</p>}
          </div>
          <div>
          <label> Buyer/Seller:</label>
          <input className='regsiterinput' type="text" name='type' placeholder='Please Enter' value={type} onChange={handleTypeChange}  />
          {errors.type && <p className='error-message'>{errors.type}</p>}
          </div>
          {/* <div>
            <label>Password:</label>
            <input className='regsiterinput' placeholder='Enter Password' type="password" value={password} onChange={handlePasswordChange} />
            {errors.password && <p className='error-message'>{errors.password}</p>}
          </div>
          <div>
            <label>Confirm Password:</label>
            <input className='regsiterinput' placeholder='Confirm Password' type="password" value={confirmpassword} onChange={handleConfirmPasswordChange} />
            {errors.confirmpassword && <p className='error-message'>{errors.confirmpassword}</p>}
            {errors.passwordMismatch && <p className='error-message'>{errors.passwordMismatch}</p>}
          </div> */}
          <button className='but_user' type="submit" disabled={registering}>{registering ? 'Registering...' : 'Register'}</button>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;

import React from 'react';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
const Register = () => {
  const [formData, setData] = useState({
    name: '',
    email: '',
    Enrollment_no: '',
    password: '',
    password2: '',
  });

  const { name, email, Enrollment_no, password, password2 } = formData;

  const onChange = (e) =>
    setData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault(); // stops the default property of onSubmit ie. the refreshing of the page
    if (password !== password2) {
      console.log(`password doesn't match!`);
    } else {
      console.log(formData);
    }
  };

  return (
    <Fragment>
      <h1
        className='text-primary'
        style={{ marginTop: '2px', fontSize: '34px' }}
      >
        Sign Up
      </h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email.
          </small>
        </div>
        <div className='form-group'>
          <input
            type='number'
            placeholder='Enrollment Number'
            name='Enrollment_no'
            value={Enrollment_no}
            onChange={(e) => onChange(e)}
            min='11'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;

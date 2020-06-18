import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [FormData, setData] = useState({
    email: '',
    Password: '',
  });

  const { email, Password } = FormData;

  const onChange = (e) =>
    setData({ ...FormData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!Password) {
      console.log(`Password is required!`);
    } else {
      console.log(FormData);
    }
  };

  return (
    <Fragment>
      <section class='container'>
        <div class='alert alert-danger'>Invalid credentials</div>
        <h1 class='large text-primary'>Sign In</h1>
        <p class='lead'>
          <i class='fas fa-user'></i> Sign into Your Account
        </p>
        <form class='form' onSubmit={(e) => onSubmit(e)}>
          <div class='form-group'>
            <input
              type='email'
              placeholder='Email Address'
              name='email'
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div class='form-group'>
            <input
              type='password'
              placeholder='Password'
              name='Password'
              value={Password}
              onChange={(e) => onChange(e)}
            />
          </div>
          <input type='submit' class='btn btn-primary' value='Login' />
        </form>
        <p class='my-1'>
          Don't have an account? <Link to='/register'>Sign Up</Link>
        </p>
      </section>
    </Fragment>
  );
};

export default Login;

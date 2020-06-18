import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1
            className='large'
            style={{ fontFamily: "'Open Sans', sans-serif" }}
          >
            Student Interaction and Innovation Platform
          </h1>
          <p className='lead'>Get connected, Work and Achieve</p>
          <div className='buttons'>
            <a
              href='register.html'
              className='btn btn-primary'
              style={{ borderRadius: '25px' }}
            >
              Sign Up
            </a>
            <Link
              to='/login'
              className='btn btn-light'
              style={{ borderRadius: '25px' }}
            >
              &nbsp;Login&nbsp;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Landing;

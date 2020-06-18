import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h2>
        <Link
          to='/'
          style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: '900' }}
        >
          S&nbsp;&nbsp;I&nbsp;&nbsp;I&nbsp;&nbsp;P,
          &nbsp;&nbsp;M&nbsp;&nbsp;A&nbsp;&nbsp;I&nbsp;&nbsp;T
        </Link>
        <br></br>
        <a
          href='index.html'
          style={{ fontSize: '1rem', fontFamily: "'Open Sans', sans-serif" }}
        >
          Maharaja Agrasen Institute Of Technology, New Delhi
        </a>
      </h2>

      <ul>
        <li>
          <a href='https://mait.ac.in/' style={{ color: '#79d70f' }}>
            MAIT,Rohini
          </a>
        </li>
        <li>
          <a href='profiles.html'>Official Bodies</a>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navbar;

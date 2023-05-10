/* eslint-disable no-unused-vars */
import logo from '../../Assets/Nav-Icons/logo.png';
import lol from '../../Assets/Nav-Icons/LoL.png';
import val from '../../Assets/Nav-Icons/valorant.png';
import csgo from '../../Assets/Nav-Icons/csgo.png';
import submit from '../../Assets/Nav-Icons/submit.png';
import leader from '../../Assets/Nav-Icons/leaderboard.png';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Logout from '../../Assets/Nav-Icons/Logout.png';
import BottomLink from './BottomLink';
import GameLink from './Gamelink';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const token = Cookies.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setLoggedin(true);
    }
  }, [token]);

  const logout = async () => {
    const url = 'https://rr-back-end.onrender.com/signout';
    const response = await fetch(url, {
      method: 'PUT',
    });
    if (response.ok) {
      setLoggedin(false);
      Cookies.remove('token');
      Cookies.remove('userName');
      navigate('/');
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  let menuRef = useRef(null);
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
  });

  return (
    <>
      <div className="app">
        <button className="hamburger" onClick={toggleMenu}>
          {showMenu ? null : (
            <svg viewBox="0 0 100 80" width="40" height="40">
              <rect width="90" height="10"></rect>
              <rect y="30" width="90" height="10"></rect>
              <rect y="60" width="90" height="10"></rect>
            </svg>
          )}
        </button>
        <div className={showMenu ? 'sidebar active' : 'sidebar'} ref={menuRef}>
          <ul>
            <GameLink
              imgSrc={val}
              altText="Valorant"
              linkText="Valorant"
              to="/valorant"
              onClick={() => setShowMenu(false)}
            />
            {/* <GameLink
                imgSrc={lol}
                altText="league"
                linkText="League"
                to="/league"
                onClick={() => setShowMenu(false)}
              /> */}
            {/* <GameLink
                imgSrc={csgo}
                altText="csgo"
                linkText="CSGO"
                to="/csgo"
                onClick={() => setShowMenu(false)}
              />  */}
            <BottomLink
              imgSrc={submit}
              altText="movie-logo"
              linkText="Submit a Clip"
              to="/submit"
              onClick={() => setShowMenu(false)}
            />
            <BottomLink
              imgSrc={leader}
              altText="movie-logo"
              linkText="Leaderboard"
              to="/leaderboard"
              onClick={() => setShowMenu(false)}
            />
            {!loggedin ? (
              <BottomLink
                imgSrc={Logout}
                altText="logout-logo"
                linkText="Login/Signup"
                to="/login"
                onClick={() => setShowMenu(false)}
              />
            ) : (
              <BottomLink
                imgSrc={Logout}
                altText="logout-logo"
                linkText="Logout"
                to="/"
                onClick={logout}
              />
            )}
          </ul>
          <hr />
          <ul>
            <li
              className="bottom-links other-links"
              onClick={() => setShowMenu(false)}
            >
              <NavLink to="/howto">How to play</NavLink>
            </li>
            <li
              className="bottom-links other-links"
              onClick={() => setShowMenu(false)}
            >
              <NavLink to="/tos">Terms of Services</NavLink>
            </li>
            <li
              className="bottom-links other-links"
              onClick={() => setShowMenu(false)}
            >
              <NavLink to="/privacy">Privacy Policy</NavLink>
            </li>
            <li
              className="bottom-links other-links"
              onClick={() => setShowMenu(false)}
            >
              <NavLink to="/bug">Report a Bug</NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
      </div>
    </>
  );
};

export default Nav;

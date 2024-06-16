import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation'>
      <span className='logo'>
      <NavLink to="/"><img src='https://cdn.freebiesupply.com/logos/large/2x/airbnb-2-logo-png-transparent.png'/></NavLink>
      </span>
    <span>
    <ul>
      <li>
        <NavLink to="/spots/new">Create a Spot</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </span>
    </div>
  );
}

export default Navigation;

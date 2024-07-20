import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='navigation'>
      <span className='logo'>
      <NavLink to="/"><img className='fake'
      src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQAB
      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'/></NavLink>
      </span>
    <span>
    <ul className='profile-button'>
      {sessionUser != null && <li className='create-spot'>
        <NavLink to="/spots/new">Create a Spot</NavLink>
      </li>}
      {isLoaded && (
        <li className='list'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </span>
    </div>
  );
}

export default Navigation;

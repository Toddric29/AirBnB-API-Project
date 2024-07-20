import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          console.log(data.message)
          setErrors(data.message);
        }
      });
  };
  const handleDemo = (e) => {
    e.preventDefault()
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
    .then(closeModal)
  }
  console.log(errors)
  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder='Username or Email'
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <div className='login-button'>
        <button className='login' disabled={credential.length < 4 || password.length < 6}type="submit">Log In</button>
        </div>
        {Object.values(errors).length > 0 && (
          <p>The provided credentials were invalid</p>
        )}
      </form>
      <form onSubmit={handleDemo}>
        <div className='Demo-button'>
          <button className='Demo'type="submit">Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;

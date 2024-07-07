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
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button disabled={credential.length < 4 || password.length < 6}type="submit">Log In</button>
        {Object.values(errors).length > 0 && (
          <p>The provided credentials were invalid</p>
        )}
      </form>
      <form onSubmit={handleDemo}>
        <div>
          <button className='Demo'type="submit">Demo User</button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import './NewSpot.css'

const CreateSpotForm = ({ hideForm }) => {
  const user = useSelector(state => state.session.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState(1);
  const [lng, setLng] = useState(1);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(1);
  const [link, setLink] = useState('');

  const updateCountry = (e) => setCountry(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateLat = (e) => setLat(e.target.value);
  const updateLng = (e) => setLng(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updateLink = (e) => setLink(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const handleCancel = () => {
    //     setAddress("");
    //     setCity("");
    //     setState("");
    //     setCountry("");
    //     setName("");
    //     setPrice(0);
    //     setDescription("");
    //   };

      if (!user) {
        return <p>Please Login</p>;
      }

    const payload = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      link
    };

    const createdSpot= await dispatch(createSpot(payload));
    if (createdSpot) {
      navigate(`/api/spots/${createdSpot.id}`);
      hideForm();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    hideForm();
  };

  return (
    <section className="new-form-holder centered middled">
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Country"
          required
          value={country}
          onChange={updateCountry} />
        <input
          type="text"
          placeholder="Address"
          required
          value={address}
          onChange={updateAddress} />
        <input
          type="text"
          placeholder="City"
          required
          value={city}
          onChange={updateCity} />
        <input
          type="text"
          placeholder="State"
          required
          value={state}
          onChange={updateState} />
        <input
          type="number"
          placeholder="Lat"
          min="0"
          max="100"
          required
          value={lat}
          onChange={updateLat} />
          <input
          type="number"
          placeholder="Lng"
          min="0"
          max="100"
          required
          value={lng}
          onChange={updateLng} />
        <input
          type="text"
          placeholder="Description"
          required
          value={description}
          onChange={updateDescription} />
        <input
          type="text"
          placeholder="Name"
          required
          value={name}
          onChange={updateName} />
        <input
          type="number"
          placeholder="Price"
          min="1"
          required
          value={price}
          onChange={updatePrice} />
        <input
          type="text"
          placeholder="Link"
          required
          value={link}
          onChange={updateLink} />
        <button type="submit">Create new Spot</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  );
};

export default CreateSpotForm;

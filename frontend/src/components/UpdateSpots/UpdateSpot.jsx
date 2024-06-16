import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editSpot, fetchSpotDetails } from '../../store/spots';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateSpot.css'

const EditSpotForm = () => {
  const user = useSelector(state => state.session.user)
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector(state => state.spots.spotDetails[spotId]);
  const [isLoaded, setIsLoaded] = useState(false)
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

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId)).then(() => setIsLoaded(true))
  }, [spotId, dispatch])

  useEffect(() => {
    if (!spot) return
    setCountry(spot.country);
    setAddress(spot.address);
    setCity(spot.city);
    setState(spot.state);
    setLat(spot.lat);
    setLng(spot.lng);
    setDescription(spot.description);
    setName(spot.name);
    setPrice(spot.price);
    setLink(spot.SpotImages[0].url);
  },[spot])

  const handleSubmit = async (e) => {
    e.preventDefault();


      if (!user) {
        return <p>Please Login</p>;
      }

    const payload = {
      ...spot,
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

    const updatedSpot= await dispatch(editSpot(payload, spotId));
    console.log(updatedSpot, '<---- UpdatedSpot')
    if (updatedSpot) {
        navigate('/spots/current/')
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    navigate('/spots/current/')
  };

  return isLoaded ? (
    <section className="new-form-holder centered middled">
      <form className="edit-spot-form" onSubmit={handleSubmit}>
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
        <button type="submit">Update Spot</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  ) : (
    <div>
        LOADING
    </div> )
};

export default EditSpotForm;

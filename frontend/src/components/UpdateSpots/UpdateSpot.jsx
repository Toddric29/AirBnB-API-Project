import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editSpot, fetchSpotDetails } from '../../store/spots';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateSpot.css'

const getUrl = (spot, index) => {
  try {
      return spot.SpotImages[index].url
  } catch (error) {
      return ''
  }
}

const EditSpotForm = () => {
  const { spotId } = useParams();
  console.log(spotId)
  const spot = useSelector(state => state.spots.spotDetails[spotId]);
  const user = useSelector(state => state.session.user)
  const [isLoaded, setIsLoaded] = useState(false)
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
  const [previewImage, setPreviewImage] = useState(getUrl(spot, 0));
  const [imageTwo, setImageTwo] = useState(getUrl(spot, 1))
  const [imageThree, setImageThree] = useState(getUrl(spot, 2))
  const [imageFour, setImageFour] = useState(getUrl(spot, 3))
  const [imageFive, setImageFive] = useState(getUrl(spot, 4))
  const [errors, setErrors] = useState({})

  const updateCountry = (e) => setCountry(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateLat = (e) => setLat(e.target.value);
  const updateLng = (e) => setLng(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updateName = (e) => setName(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updatePreviewImage = (e) => setPreviewImage(e.target.value);
  const updateImageTwo = (e) => setImageTwo(e.target.value);
  const updateImageThree = (e) => setImageThree(e.target.value);
  const updateImageFour = (e) => setImageFour(e.target.value);
  const updateImageFive = (e) => setImageFive(e.target.value);

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
    setPreviewImage(getUrl(spot,0));
    setImageTwo(getUrl(spot,1));
    setImageThree(getUrl(spot,2));
    setImageFour(getUrl(spot,3));
    setImageFive(getUrl(spot,4));
  },[spot])
console.log(spot)
  const handleSubmit = async (e) => {
    e.preventDefault();


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
      previewImage,
      images: [
        {
            url: imageTwo
        },
        {
            url: imageThree
        },
        {
            url: imageFour
        },
        {
            url: imageFive
        }
      ]
    };

    dispatch(editSpot(payload, spot.id))
    .then(() => navigate(`/spots/${spot.id}`))
    .catch(async res => {
      const errors = await res.json()
      console.log(errors)
      setErrors(errors.errors)
    })
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    navigate('/spots/current/')
  };

  return isLoaded ? (
    <section className="new-form-holder centered middled">
        <h1>Update a Spot</h1>
        <h2>Where&apos;s your place located?</h2>
        <h3>Guests will only get your exact address once they
            booked a reservation.</h3>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={updateCountry} />
          {errors.country && (<p>{errors.country}</p>)}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={updateAddress} />
          {errors.address && (<p>{errors.address}</p>)}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={updateCity} />
          {errors.city && (<p>{errors.city}</p>)}
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={updateState} />
          {errors.state && (<p>{errors.state}</p>)}
        <input
          type="number"
          placeholder="Lat"
          value={lat}
          onChange={updateLat} />
          {errors.lat && (<p>{errors.lat}</p>)}
          <input
          type="number"
          placeholder="Lng"
          value={lng}
          onChange={updateLng} />
          {errors.lng && (<p>{errors.lng}</p>)}
          <h2>Describe your place to guests</h2>
          <h3>Mention the best features of your
            space, any special amentities like
            fast wifi or parking, and what you
             love about the neighborhood.</h3>
        <input
          type="text"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={updateDescription} />
          {errors.description && (<p>{errors.description}</p>)}
          <h2>Create a title for your spot</h2>
          <h3>Catch guests&apos; attention with a spot title that
            highlights what makes your place special.</h3>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={updateName} />
          {errors.name && (<p>{errors.name}</p>)}
          <h2>Set a base price for your spot</h2>
          <h3>Competitive pricing can help your listing stand out
             and rank higher in search results.</h3>
        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={updatePrice} />
          {errors.price && (<p>{errors.price}</p>)}
          <h2>Liven up your spot with photos</h2>
          <h3>Submit a link to at least one photo to publish your spot.</h3>
        <input
          type="text"
          placeholder="Preview Image"
          value={previewImage}
          onChange={updatePreviewImage} />
          {errors.previewImage && (<p>{errors.previewImage}</p>)}
          <input
          type="text"
          placeholder="Image URL"
          value={imageTwo}
          onChange={updateImageTwo} />
          <input
          type="text"
          placeholder="Image URL"
          value={imageThree}
          onChange={updateImageThree} />
          <input
          type="text"
          placeholder="Image URL"
          value={imageFour}
          onChange={updateImageFour} />
          <input
          type="text"
          placeholder="Image URL"
          value={imageFive}
          onChange={updateImageFive} />
        <button type="submit">Update Spot</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  )
  : (
    <div>
        LOADING
    </div> )
};

export default EditSpotForm;

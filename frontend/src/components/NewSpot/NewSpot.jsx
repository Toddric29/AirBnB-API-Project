import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot, editSpot, fetchSpotDetails } from '../../store/spots';
import './NewSpot.css'

const getUrl = (spot, index) => {
    try {
        return spot.SpotImages[index].url
    } catch (error) {
        return ''
    }
}
const CreateSpotForm = ({ spot }) => {
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
  const [price, setPrice] = useState();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(errors)

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
      images: [
        {
            url: previewImage,
            preview: true
        },
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


    if (spot) {
        dispatch(fetchSpotDetails({...payload, spotId: spot.id}))
        .then(() => navigate(`/spots/${spot.id}`))
        .catch(async res => {
            const data = await res.json()
            console.log(data.errors)
            setErrors(data.errors)
        })
        return;
    }
    dispatch(createSpot(payload))
    .then((createdSpot) => navigate(`/spots/${createdSpot.id}`))
      .catch(async (res) => {
        const data = res
        console.log(data.message)
        setErrors(data.errors)
      })
    //   hideForm();
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    // hideForm();
  };

  return (
    <section className="new-form-holder centered middled">
        <h1>Create a Spot</h1>
        <h2>Where&apos;s your place located?</h2>
        <h3>Guests will only get your exact address once they
            booked a reservation.</h3>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <input
          type="text"
          required placeholder="Country"
        onInvalid={F => F.target.setCustomValidity('Chep!')}
        onInput={F => F.target.setCustomValidity('')}
          value={country}
          onChange={updateCountry} />
          {errors.country && (<p>{errors.country}</p>)}
        <input
          type="text"
          placeholder="Address"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={address}
          onChange={updateAddress} />
        <input
          type="text"
          placeholder="City"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={city}
          onChange={updateCity} />
        <input
          type="text"
          placeholder="State"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={state}
          onChange={updateState} />
        <input
          type="number"
          placeholder="Lat"
          min="0"
          max="100"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={lat}
          onChange={updateLat} />
          <input
          type="number"
          placeholder="Lng"
          min="0"
          max="100"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={lng}
          onChange={updateLng} />
          <h2>Describe your place to guests</h2>
          <h3>Mention the best features of your
            space, any special amentities like
            fast wifi or parking, and what you
             love about the neighborhood.</h3>
        <input
          type="text"
          placeholder="Please write at least 30 characters"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={description}
          onChange={updateDescription} />
          <h2>Create a title for your spot</h2>
          <h3>Catch guests&apos; attention with a spot title that
            highlights what makes your place special.</h3>
        <input
          type="text"
          placeholder="Name of your spot"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={name}
          onChange={updateName} />
          <h2>Set a base price for your spot</h2>
          <h3>Competitive pricing can help your listing stand out
             and rank higher in search results.</h3>
        <input
          type="text"
          placeholder="Price per night (USD)"
          min="1"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={price}
          onChange={updatePrice} />
          <h2>Liven up your spot with photos</h2>
          <h3>Submit a link to at least one photo to publish your spot.</h3>
        <input
          type="text"
          placeholder="Preview Image"
          required
          onInvalid={F => F.target.setCustomValidity('Chep!')}
          onInput={F => F.target.setCustomValidity('')}
          value={previewImage}
          onChange={updatePreviewImage} />
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
        <button type="submit">Create new Spot</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
      </form>
    </section>
  );
};

export default CreateSpotForm;

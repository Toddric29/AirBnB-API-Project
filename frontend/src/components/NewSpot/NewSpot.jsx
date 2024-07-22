import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({})
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


    // if (spot) {
    //    return dispatch(editSpot({...payload, spotId: spot.id}))
    //     .then(() => navigate(`/spots/${spot.id}`))
    //     .catch(async (res) => {
    //         const data = await res.json()
    //         console.log(data.errors)
    //         setErrors(data.errors)
    //     })
    //     return;
    // }
    dispatch(createSpot(payload))
    .then( (newSpot) =>  {
      console.log(newSpot)
      navigate(`/spots/${newSpot.id}`)
    })
    .catch(async res => {
      console.log(res)
        const errors = await res.json()
        console.log(errors)
        setErrors(errors.errors)
    })
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    // hideForm();
  };

  return (
    <section className="new-form-holder centered middled">
        <h1 style={{paddingRight: 400}}>Create a Spot</h1>
        <h2 style={{textAlign: 'center', paddingRight: 250}}>Where&apos;s your place located?</h2>
        <h3 style={{textAlign: 'center', paddingLeft: 30}}>Guests will only get your exact address once they
            booked a reservation.</h3>
      <form className="create-spot-form" onSubmit={handleSubmit}>
        <div className='location'>
        <div>
          <p>Country</p>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={updateCountry} />
          {errors.country && (<p>{errors.country}</p>)}
        </div>
        <p>Address</p>
        <div>
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={updateAddress} />
          {errors.address && (<p>{errors.address}</p>)}
        </div>
        <span>City</span> <span className='state'>State</span>
        <div className='city-state'>
        <span>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={updateCity} />
          {errors.city && (<p>{errors.city}</p>)}
        </span>
        ,
        <span>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={updateState} />
          {errors.state && (<p>{errors.state}</p>)}
        </span>
        </div>
        <span>Latitude</span><span className='longitude'>Longitude</span>
        <div className='lat-lng'>
        <input
          type="number"
          placeholder="Lat"
          value={lat}
          onChange={updateLat} />
          {errors.lat && (<p>{errors.lat}</p>)}
          ,
        <input
          type="number"
          placeholder="Lng"
          value={lng}
          onChange={updateLng} />
          {errors.lng && (<p>{errors.lng}</p>)}
        </div>
        </div>
          <h2 style={{textAlign: 'center', paddingRight: 225}}>Describe your place to guests</h2>
          <h4 style={{textAlign: 'center', paddingLeft: 370}}>Mention the best features of your
            space, any special amentities like
            fast wifi or parking, and what you
             love about the neighborhood.</h4>
        <div style={{paddingLeft: 450}}>
        <input
          type="text"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={updateDescription} />
          {errors.description && (<p>{errors.description}</p>)}
        </div>
          <h2 style={{textAlign: 'center', paddingRight: 250}}>Create a title for your spot</h2>
          <h3 style={{textAlign: 'center', paddingLeft: 160}}>Catch guests&apos; attention with a spot title that
            highlights what makes your place special.</h3>
        <div style={{paddingLeft: 450}}>
        <input
          type="text"
          placeholder="Name of your spot"
          value={name}
          onChange={updateName} />
          {errors.name && (<p>{errors.name}</p>)}
        </div>
          <h2 style={{textAlign: 'center', paddingRight: 225}}>Set a base price for your spot</h2>
          <h3 style={{textAlign: 'center', paddingLeft: 155}}>Competitive pricing can help your listing stand out
             and rank higher in search results.</h3>
        <div style={{paddingLeft: 450}}>
          $
        <input
          type="number"
          placeholder="Price per night (USD)"
          value={price}
          onChange={updatePrice} />
          {errors.price && (<p>{errors.price}</p>)}
        </div>
          <h2 style={{textAlign: 'center', paddingRight: 200}}>Liven up your spot with photos</h2>
          <h3 style={{textAlign: 'center', paddingRight: 80}}>Submit a link to at least one photo to publish your spot.</h3>
        <div style={{paddingLeft: 450}}>
        <input
          type="text"
          placeholder="Preview Image"
          value={previewImage}
          onChange={updatePreviewImage} />
          {errors.previewImage && (<p>{errors.previewImage}</p>)}
        </div>
        <div style={{paddingLeft: 450, paddingTop: 12}}>
        <input
          type="text"
          placeholder="Image URL"
          value={imageTwo}
          onChange={updateImageTwo} />
        </div>
        <div style={{paddingLeft: 450, paddingTop: 12}}>
        <input
          type="text"
          placeholder="Image URL"
          value={imageThree}
          onChange={updateImageThree} />
        </div>
        <div style={{paddingLeft: 450, paddingTop: 12}}>
        <input
          type="text"
          placeholder="Image URL"
          value={imageFour}
          onChange={updateImageFour} />
        </div>
        <div style={{paddingLeft: 450, paddingTop: 12, paddingBottom: 12}}>
        <input
          type="text"
          placeholder="Image URL"
          value={imageFive}
          onChange={updateImageFive} />
        </div>
        <span style={{paddingLeft: 450}}>
        <button type="submit">Create new Spot</button>
        <button type="button" onClick={handleCancelClick}>Cancel</button>
        </span>
      </form>
    </section>
  );
};

export default CreateSpotForm;

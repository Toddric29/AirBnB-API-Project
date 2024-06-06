import './SpotDetails.css';
import { fetchSpotDetails } from '../../store/spots';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.spotDetails[spotId]);
    console.log(spot)
    useEffect(() => {
        dispatch(fetchSpotDetails(spotId)).then(() => setIsLoaded(true));
    }, [spotId, dispatch])

    return isLoaded ? (
        <div>
            <div>
            <h3>{spot.name}</h3>
            <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
            </div>
            <div>
                <img src={spot.previewImage}/>
            </div>
            <div>
                <h4>{`Hosted by ${spot.firstName} ${spot.lastName}`}</h4>
            </div>
            <div>
                <p>{spot.description}</p>
            </div>
            <div>
                <div>
                    <h3>{`$${spot.price} night`}</h3>
                    <p>{spot.avgRating || 'New'}</p>
                </div>
            </div>
            <div>
                <div>
                    <h2>{spot.avgRating}</h2>
                </div>
            </div>
        </div>
    ) : (
        <div>
            LOADING
        </div>
    )
}

export default SpotDetails

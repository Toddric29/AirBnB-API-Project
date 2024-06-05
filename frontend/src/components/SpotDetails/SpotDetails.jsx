import './AllSpots.css';
import { fetchSpotDetails } from '../../store/spots';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SpotDetail = () => {
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector(state => state.spot[spotId]);
    useEffect(() => {
        dispatch(fetchSpotDetails(spotId))
    },[spotId])

    return (
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
    )
}

export default SpotDetail

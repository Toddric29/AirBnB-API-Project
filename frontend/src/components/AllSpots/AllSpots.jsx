import './AllSpots.css';
import { fetchSpots } from '../../store/spots';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots.allSpots)
    console.log(spots)
    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])
    return (
        <div>
            {Object.values(spots).map(spot => (
                <div key={spot.id}>
                    <h3>{spot.name}</h3>
                    <img src={spot.previewImage}/>
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <h4>{spot.avgRating || 'New'}</h4>
                    <h4>{`$${spot.price} night`}</h4>
                </div>
            ))}
        </div>
    )
}

export default AllSpots

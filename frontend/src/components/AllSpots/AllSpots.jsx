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
    }, [])
    return (
        <div>
            {Object.values(spots).map(spot => (
                <div key={spot.id}>
                    <h3>{spot.name}</h3>
                </div>
            ))}
        </div>
    )
}

export default AllSpots

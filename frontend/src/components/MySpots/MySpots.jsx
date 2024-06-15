import './MySpots.css';
import { fetchMySpots } from '../../store/spots';
import { useEffect} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { NavLink} from 'react-router-dom';

const MySpots = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots.mySpots)
    console.log(spots)
    useEffect(() => {
        dispatch(fetchMySpots())
    }, [dispatch])
    return (
        <main>
            <nav>
            {Object.values(spots).map(spot => {
                return (
                    <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                    <div key={spot.id}>
                    <h3>{spot.name}</h3>
                    <img src={spot.previewImage}/>
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <h4>{spot.avgRating || 'New'}</h4>
                    <h4>{`$${spot.price} night`}</h4>
                </div>
                    </NavLink>
                )
                })}
            </nav>
        </main>
    )
}

export default MySpots

import './MySpots.css';
import { fetchMySpots } from '../../store/spots';
import { useEffect} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { NavLink, useNavigate} from 'react-router-dom';
// import * as spotActions from '../../store/spots'
import { removeSpot } from '../../store/spots';

const MySpots = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const spots = useSelector((state) => state.spots.mySpots);
    console.log(spots)
    useEffect(() => {
        dispatch(fetchMySpots())
    }, [dispatch])

    const createSpot = () => {
        navigate(`/spots/new`)
    }
    const editSpots = (spotId) => {
        navigate(`/spots/${spotId}/edit`)
        }
    const deleteSpot = (spotId) => {
        dispatch(removeSpot(spotId)).then(() => navigate('/'))
    }

    return (
        <main>
            <h1>Manage Your Spots</h1>
            <div>
            {Object.values(spots).length === 0 &&
            <NavLink to="/spots/new">Create a Spot</NavLink>}
            {Object.values(spots).map(spot => {
                let rating = '★ '
                if (spot.avgRating === null) {
                    spot.avgRating = 'New'
                }
                return (
                    <div key={spot.city}>
                    <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                    <div key={spot.id}>
                    <h3>{spot.name}</h3>
                    <img src={spot.previewImage}/>
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <h4>{rating}{spot.avgRating}</h4>
                    <h4>{`$${spot.price} night`}</h4>
                </div>
                    </NavLink>
                    <div key={spot.id}>
                    <button onClick={() => editSpots(spot.id)}>Update</button>
                    <button onClick={() => deleteSpot(spot.id)}>Delete</button>
                    </div>
                    </ div>
                )
                })}
            </div>
        </main>
    )
}

export default MySpots

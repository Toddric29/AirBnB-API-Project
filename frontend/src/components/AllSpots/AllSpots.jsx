import './AllSpots.css';
import { fetchSpots } from '../../store/spots';
import { useEffect} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { NavLink} from 'react-router-dom';

const AllSpots = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots.allSpots)
    console.log(spots)
    useEffect(() => {
        dispatch(fetchSpots())
    }, [dispatch])
    return (
        <main>
            <nav>
            {Object.values(spots).map(spot => {
                let rating = '★ '
                if (spot.avgRating === null) {
                    spot.avgRating = 'New'
                }
                if (spot.avgRating === 'New') {
                    rating = ''
                }
                return (
                    <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                    <div key={spot.id}>
                    <h3>{spot.name}</h3>
                    <div>
                    <img title={spot.name} src={spot.previewImage}/>
                    </div>
                    <h4>{`${spot.city}, ${spot.state}`}</h4>
                    <h4>{rating}{spot.avgRating}</h4>
                    <h4>{`$${spot.price} night`}</h4>
                </div>
                    </NavLink>
                )
                })}
            </nav>
        </main>
    )
}

export default AllSpots

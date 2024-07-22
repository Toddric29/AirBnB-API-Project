import './MySpots.css';
import { fetchMySpots } from '../../store/spots';
import { useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { NavLink, useNavigate} from 'react-router-dom';
// import * as spotActions from '../../store/spots'
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';

const MySpots = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const spots = useSelector((state) => state.spots.mySpots);
    console.log(spots)

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
          if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
          }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);

      const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        dispatch(fetchMySpots())
    }, [dispatch])

    // const createSpot = () => {
    //     navigate(`/spots/new`)
    // }
    const editSpots = (spotId) => {
        navigate(`/spots/${spotId}/edit`)
        }
    // const deleteSpot = (spotId) => {
    //     dispatch(removeSpot(spotId)).then(() => navigate('/'))
    // }

    return (
        <main className='allSpots'>
            <h1>Manage Your Spots</h1>
            <nav className='spots'>
            {Object.values(spots).length === 0 &&
            <NavLink to="/spots/new">Create a Spot</NavLink>}
            {Object.values(spots).map(spot => {
                let rating = '★ '
                if (spot.avgRating === null) {
                    spot.avgRating = 'New'
                }
                return (
                    <div style={{width: 260}}key={spot.city}>
                    <NavLink key={spot.name} to={`/spots/${spot.id}`}>
                    <div className='spotse' key={spot.id}>
                    <div>
                    <img src={spot.previewImage}/>
                    </div>
                    <div className='description'>
                        <div className='description-left'>
                        <h4>{`${spot.city}, ${spot.state}`}</h4>
                        <h4>{`$${spot.price} night`}</h4>
                        </div>
                        <div className='description-right'>
                        <h5 >{rating}{spot.avgRating}</h5>
                        </div>
                    </div>
                </div>
                    </NavLink>
                    <div key={spot.id}>
                    <button className='manage-buttons'onClick={() => editSpots(spot.id)}>Update</button>
                    <OpenModalButton
                        className='manage-buttons'
                        buttonText="Delete"
                        onItemClick={closeMenu}
                        modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                        />
                    </div>
                    </ div>
                )
                })}
            </nav>
        </main>
    )
}

export default MySpots

import './SpotDetails.css';
import { fetchSpotDetails } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import { useModal } from '../../context/Modal';

const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const {setModalContent} = useModal();
    const spot = useSelector(state => state.spots.spotDetails[spotId]);
    const reviews = useSelector(state => state.reviews);
    // console.log(spot, reviews)
    useEffect(() => {
        dispatch(fetchSpotDetails(spotId)).then(() => setIsLoaded(true));
        dispatch(fetchReviews(spotId)).then(() => setIsLoaded(true));
    }, [spotId, dispatch])

    return isLoaded ? (
        <div>
            <div>
            <h3>{spot.name}</h3>
            <p>{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
            </div>
            <img src={spot.SpotImages[0].url}/>
            <div>
                <h4>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h4>
            </div>
            <div>
                <p>{spot.description}</p>
            </div>
            <div>
                <div>
                    <h3>{`$${spot.price} night`}</h3>
                    <p>{`${spot.avgStarRating} ★ Rating` || 'New'}</p>
                    <p>{`${spot.numReviews} review(s)`}</p>
                </div>
            </div>
            <div>
                <div>
                    <h2>{`${spot.avgStarRating} ★ Rating` || 'New'}</h2>
                </div>
            </div>
            <div>
            <h2>{`${spot.numReviews} review(s)`|| 'New'}</h2>
            <button onClick={() => setModalContent(<PostReviewModal spotId = {spotId}/>)}>Post Your Review</button>
            <div>
            {Object.values(reviews).map(review => {
                // console.log(review.User.firstName, '<---- Review')
                return (
                    <div key={review.id}>
                    <h3>{review.User.firstName}</h3>
                    <h3>{new Date(Date.parse(review.updatedAt)).toLocaleString("en-US", {
                        month: 'long',
                        year: 'numeric'
                    })}</h3>
                    <h3>{review.review}</h3>
                </div>
                )
                })}
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

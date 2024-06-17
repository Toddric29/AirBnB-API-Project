import './SpotDetails.css';
import { fetchSpotDetails } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useParams } from 'react-router-dom';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import SpotDetailsModal from '../SpotDetailsModal/SpotDetailsModal';
import { useModal } from '../../context/Modal';

const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const {setModalContent} = useModal();
    const spot = useSelector(state => state.spots.spotDetails[spotId]);
    const reviews = useSelector(state => state.reviews);
    useEffect(() => {
        Promise.all([
        dispatch(fetchSpotDetails(spotId)),
        dispatch(fetchReviews(spotId))
        ]).then(() => setIsLoaded(true))
    }, [spotId, dispatch])

    // useEffect(() => {
    //     dispatch(fetchSpotDetails(spotId));
    // }, [reviews, dispatch])
    let rating = '★ '
    let reviewText = ' review'
    if (isLoaded) {
    if (spot.avgStarRating === null) {
        spot.avgStarRating = 'New'
    }
    if (spot.numReviews === null) {
        spot.numReviews = 'New'
    }
    if (spot.numReviews === 'New') {
        reviewText = ''
    }
    if (spot.numReviews > 1) {
        reviewText = ' reviews'
    }
}
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
                    <p>{rating}{spot.avgStarRating.toFixed(2)}</p>
                    <p>{spot.numReviews}{reviewText}</p>
                    <button onClick={() => setModalContent(<SpotDetailsModal/>)}>Reserve</button>
                </div>
            </div>
            <div>
                <div>
                    <h2>{rating}{spot.avgStarRating.toFixed(2)}</h2>
                </div>
            </div>
            <div>
            <h2>{spot.numReviews}{reviewText}</h2>
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

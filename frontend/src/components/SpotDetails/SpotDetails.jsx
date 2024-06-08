import './SpotDetails.css';
import { fetchSpotDetails } from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.spotDetails[spotId]);
    const reviews = useSelector(state => state.reviews);
    console.log(spot, reviews)
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
                    <p>{spot.avgStarRating || 'New'}</p>
                </div>
            </div>
            <div>
                <div>
                    <h2>{spot.avgStarRating || 'New'}</h2>
                </div>
            </div>
            <div>
            <h2>{spot.numReviews || 'New'}</h2>
            <div>
            {Object.values(reviews).map(review => {
                return (
                    <div key={review.id}>
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


// const ReviewDetails = () => {
//     const [isLoaded, setIsLoaded] = useState(false)
//     const dispatch = useDispatch()
//     const { reviewId } = useParams();
//     const reviews = useSelector(state => state.spots.reviews[reviewId]);
//     console.log(reviews)
//     useEffect(() => {
//         dispatch(fetchReviews(spotId)).then(() => setIsLoaded(true));
//     }, [spotId, dispatch])

//     return isLoaded ? (
//         <main>
//             {Object.values(reviews).map(review => {
//                 return (
//                     <div key={review.id}>
//                     <h3>{review.firstName}</h3>
//                     <h4>{review.createdAt}</h4>
//                     <h4>{review.review}</h4>
//                 </div>
//                 )
//                 })}
//         </main>
//     ) : (
//         <div>
//             LOADING
//         </div>
//     )
// }
export default SpotDetails

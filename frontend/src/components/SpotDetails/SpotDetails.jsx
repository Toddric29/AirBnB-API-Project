import './SpotDetails.css';
import { fetchSpotDetails} from '../../store/spots';
import { fetchReviews } from '../../store/reviews';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PostReviewModal from '../PostReviewModal/PostReviewModal';
import SpotDetailsModal from '../SpotDetailsModal/SpotDetailsModal';
import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReivewModal';

const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const { spotId } = useParams();
    const {setModalContent} = useModal();
    const sessionUser = useSelector(state => state.session.user)
    const spot = useSelector(state => state.spots.spotDetails[spotId]);
    const reviews = useSelector(state => state.reviews);
    const id = sessionUser ? sessionUser.id : null
    const alreadyReviewed = Object.values(reviews).find(review => review.User.id === id);
    console.log(spot)
    console.log(sessionUser)
    console.log(reviews)
    let previewImage;
    let spotImages = [];

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
        Promise.all([
        dispatch(fetchSpotDetails(spotId)),
        dispatch(fetchReviews(spotId)),
        ]).then(() => setIsLoaded(true))
    }, [spotId, dispatch])

    let rating = '★ '
    let reviewText = ' review'
    if (isLoaded) {
        spot.SpotImages.map(image => {
            if (image.preview === true) {
                previewImage = <img src={image.url} key={image.id}  className="preview-image"/>
            }

            if (image.url !== '' && image.preview !== true) {
                spotImages.push(<img src={image.url} key={image.id}  className="other-images"/>)
            }
        })
    if (spot.avgStarRating === null) {
        spot.avgStarRating = 'New'
    }
    if (spot.avgStarRating != 'New') {
        spot.avgStarRating = `${parseFloat(spot.avgStarRating).toFixed(2)}  · `
    }
    if (spot.numReviews === null) {
        spot.numReviews = ''
    }
    if (spot.numReviews === '') {
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
            <div>
            {previewImage}
            </div>
            <div>
            {spotImages && (
                <div className="other-images-div">
                    {spotImages}
                </div>
            )}
            </div>
            <div>
                <h4>{`Hosted by ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h4>
            </div>
            <div>
                <p>{spot.description}</p>
            </div>
            <div>
                <div>
                    <h3>{`$${spot.price} night`}</h3>
                    <p>{`${rating}${spot.avgStarRating}${spot.numReviews}${reviewText}`}</p>
                    <button onClick={() => setModalContent(<SpotDetailsModal/>)}>Reserve</button>
                </div>
            </div>
            <div>
                <div>
                    <h2>{`${rating}${spot.avgStarRating}${spot.numReviews}${reviewText}`}</h2>
                </div>
            </div>
            <div>
            <button hidden={id === spot.Owner.id || sessionUser.id === null || alreadyReviewed} onClick={() => setModalContent(<PostReviewModal spotId = {spotId}/>)}>Post Your Review</button>
            {Object.values(reviews).length === 0 && id != spot.id && id != null && (
                <p>Be the first to post a review!</p>
            )}
            <div>
            {Object.values(reviews).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(review => {
                return (
                    <div key={review.id}>
                    <h3>{review.User.firstName}</h3>
                    <h3>{new Date(Date.parse(review.updatedAt)).toLocaleString("en-US", {
                        month: 'long',
                        year: 'numeric'
                    })}</h3>
                    <h3>{review.review}</h3>
                    {review === alreadyReviewed &&
                        <OpenModalButton hidden={review != alreadyReviewed}
                        buttonText="Delete"
                        onItemClick={closeMenu}
                        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spot.id} />}
                        />
                    }
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

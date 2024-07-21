import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews';
import { fetchReviews } from '../../store/reviews';
import './PostReview.css';
import { fetchSpotDetails } from '../../store/spots';

const PostReviewModal= ({spotId}) => {
    const { closeModal } = useModal();
      const dispatch = useDispatch();
      const [review, setReview] = useState("")
      const [stars, setStars] = useState(null);
      const [hover, setHover] = useState(null)
      const [errors, setErrors] = useState({});


      const handleSubmit = async (e) => {
          e.preventDefault()
          if (review) {
            setErrors({});
            console.log(review, stars, spotId)
            return dispatch(reviewActions.addNewReview(spotId,{
                  review,
                  stars
              })
            )
            .then(() => dispatch(fetchSpotDetails(spotId)))
            .then(() => dispatch(fetchReviews(spotId)))
            .then(closeModal)
            .catch(async (res) => {
              const data = await res.json();
            //   console.log(data)
              if (data?.errors) {
                  setErrors(data.errors)
              }
            });
          }
          return setErrors({
            review: "Review can't be blank"
          })
      }

      return (
        <>
          <form onSubmit={handleSubmit}>
            <h1>How was your stay?</h1>
            <label>
              Review
              <input
                type="text"
                placeholder="Leave your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </label>
            {errors.review && <p>{errors.review}</p>}
            <div>
                    {[...Array(5)].map((_, index) => {
                    const currentRating = index + 1;
                    return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onClick={() => setStars(currentRating)}
                        />
                        <span
                            style={{ color: currentRating <= (hover || stars) ? '#ffc107' : 'grey' }}
                            onMouseEnter={() => setHover(currentRating)}
                            onMouseLeave={() => setHover(null)}
                        >
                            &#9733;
                        </span>
                    </label>
                    );
                    })}
                <label>Stars</label>
                {errors.stars && <p>{errors.stars}</p>}
                </div>
            <button disabled={review.length < 10}type="submit">Submit Your Review</button>
          </form>
        </>
      );
  }

  export default PostReviewModal;

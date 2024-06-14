import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews';
import './PostReview.css';

const PostReviewModal= ({spotId}) => {
    const { closeModal } = useModal();
      const dispatch = useDispatch();
      const [review, setReview] = useState("")
      const [stars, setStars] = useState(0);
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
            <label>
              Review
              <input
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </label>
            {errors.review && <p>{errors.review}</p>}
            <label>
              Stars
              <input
                type="number"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
              />
            </label>
            <button type="submit">Create Review</button>
          </form>
        </>
      );
  }

  export default PostReviewModal;

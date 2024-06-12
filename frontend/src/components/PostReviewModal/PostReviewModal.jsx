import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './PostReview.css';

const PostReviewModal = ({ spotId }) => {
    const { closeModal } = useModal();
      const dispatch = useDispatch();
      const [review, setReview] = useState("")
      const [stars, setStars] = useState(0);
      const [hover, setHover] = useState(0);

      const handleSubmit = async (e) => {
          e.preventDefault()

          const payload = {
              review,
              stars
          }
          const newReview = await dispatch(fetchNewReview(spotId, payload))
          closeModal()

          return console.log(newReview)
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

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews'

const loadReviews = (payload) => {
  return {
    type: LOAD_REVIEWS,
    payload
  }
}

export const fetchReviews = (spotId) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const data = await res.json()
    dispatch(loadReviews(data));
  }
}
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      const allReviews = {}
      action.payload.Reviews.forEach(review => allReviews[review.id]=review)
      return {
        ...allReviews
      }
    }
    default:
      return state;
  }
};

export default reviewsReducer

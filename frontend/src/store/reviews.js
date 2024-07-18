import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews'
const NEW_REVIEW = 'reviews/newReview'
const DELETE_REVIEW = 'spots/deleteReview'

const loadReviews = (payload) => {
  return {
    type: LOAD_REVIEWS,
    payload
  }
}

const newReview = (payload) => ({
  type: NEW_REVIEW,
  payload
})
export const deleteReview = (payload) => ({
  type: DELETE_REVIEW,
  payload
})
export const fetchReviews = (spotId) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const data = await res.json()
    dispatch(loadReviews(data));
    return res
  }
}

export const addNewReview = (spotId, payload) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    // if (res.ok) {
      const data = await res.json();
      dispatch(newReview(data));
    // }
    return res;
};

export const fetchDeleteReview = (reviewId) => async () => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE'
  });

  return res
}

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_REVIEWS: {
      const allReviews = {}
      action.payload.Reviews.forEach(review => allReviews[review.id]={...review})
      return allReviews
    }
    case NEW_REVIEW: {
      return state
      // console.log(state, '<------0')
      // const reviews = {...state}
      // console.log(reviews, '<-------1')
      // reviews[action.payload.id] = action.payload;
      // console.log(reviews, '<-------2')
      // return reviews;
    }
    case DELETE_REVIEW: {
      const reviewId = action.payload
      const newState = {...state}
      newState.reviews = newState.reviews ? {...newState.reviews} : {}
      delete newState.reviews[reviewId]
      return newState
  }
    default:
      return state;
  }
};

export default reviewsReducer

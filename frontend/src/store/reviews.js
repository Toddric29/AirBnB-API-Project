import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/loadReviews'
const NEW_REVIEW = 'reviews/newReview'

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
export const fetchReviews = (spotId) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

  if (res.ok) {
    const data = await res.json()
    dispatch(loadReviews(data));
  }
}

export const addNewReview = (spotId, payload) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      dispatch(newReview(data));
      return data;
    }
  } catch (err) {
    console.error("Could not create review", err);
  }
};

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
    case NEW_REVIEW: {
      const newReview = action.payload;
      return { [newReview.id]: newReview };
    }
    default:
      return state;
  }
};

export default reviewsReducer

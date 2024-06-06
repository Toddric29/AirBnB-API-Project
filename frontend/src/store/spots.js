import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spots/loadSpots'
const LOAD_SPOT = 'spots/loadSpot'

const loadSpots = (payload) => {
    return {
        type: LOAD_SPOTS,
        payload
    }
}

const loadSpot = (payload) => ({
    type: LOAD_SPOT,
    payload
})
export const fetchSpots = () => async(dispatch) => {
    const res = await csrfFetch('/api/spots')

    if (res.ok) {
        const data = await res.json()
        dispatch(loadSpots(data.Spots))
    }
};
const initialState = { allSpots: {}, spotDetails: {} };

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const details = await res.json();
        dispatch(loadSpot(details));
    }
};


const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:{
        console.log(action, action.spot)
        const allSpots = {...state.allSpots}
        action.payload.forEach(spot => allSpots[spot.id]=spot)
        return {
            ...state,
            allSpots
        }
    }
    case LOAD_SPOT: {
        const spotDetails = {...state.spotDetails}
        spotDetails[action.payload.id] = action.payload
        return {...state, spotDetails}
    }
    default:
      {
        return state;
    }
  }
};

export default spotsReducer

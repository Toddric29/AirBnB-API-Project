const LOAD_SPOTS = 'spots/loadSpots'

const loadSpots = (payload) => {
    return {
        type: LOAD_SPOTS,
        payload
    }
}

export const fetchSpots = () => async(dispatch) => {
    const res = await fetch('/api/spots')

    if (res.ok) {
        const data = await res.json()
        dispatch(loadSpots(data.Spots))
    }
}
const initialState = { allSpots: {}, spotDetails: {} };

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
        // console.log(action)
        const allSpots = {...state.allSpots}
        action.payload.forEach(spot => allSpots[spot.id]=spot)
        // console.log(allSpots)
        return {
            ...state,
            allSpots
        }
    default:
      return state;
  }
};

export default spotsReducer

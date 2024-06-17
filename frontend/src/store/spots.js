import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spots/loadSpots'
const LOAD_SPOT = 'spots/loadSpot'
const NEW_SPOT = 'spots/newSpot'
const MY_SPOTS = 'spots/mySpot'
const REMOVE_SPOT = 'spots/removeSpot'


const loadSpots = (payload) => {
    return {
        type: LOAD_SPOTS,
        payload
    }
};

const loadSpot = (payload) => ({
    type: LOAD_SPOT,
    payload
});

const newSpot = (payload) => ({
    type: NEW_SPOT,
    payload
});

const mySpot = (payload) => ({
    type: MY_SPOTS,
    payload
})

export const removeSpot = (payload) => ({
    type: REMOVE_SPOT,
    payload
})


export const fetchSpots = () => async(dispatch) => {
    const res = await csrfFetch('/api/spots')

    if (res.ok) {
        const data = await res.json()
        dispatch(loadSpots(data.Spots))
    }
};
const initialState = { allSpots: {}, spotDetails: {}, mySpots: {} };

export const fetchSpotDetails = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);

    if (res.ok) {
        const details = await res.json();
        dispatch(loadSpot(details));
    }
    return res
};


export const createSpot = (payload) => async (dispatch) => {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(newSpot(data));
        return data
    }
    return res
}

export const fetchMySpots = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current');
    if (res.ok) {
        const data = await res.json();
        console.log(data)
        dispatch(mySpot(data))
    }
    return res
}

export const editSpot = (payload, spotId) => async dispatch => {
    console.log(payload, '<--- Payload')
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    if (res.ok) {
        const edittedSpot = await res.json();
        dispatch(newSpot(edittedSpot))
        return edittedSpot;
    }
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:{
        const allSpots = {...state.allSpots}
        action.payload.forEach(spot => allSpots[spot.id]={...spot})
        return {
            ...state,
            allSpots
        }
    }
    case LOAD_SPOT: {
        const newState = {...state}
        if (newState.spotDetails) {
            newState.spotDetails = {...newState.spotDetails}
        }
        else {
            newState.spotDetails = []
        }
        // const spotDetails = {...state.spotDetails}
        newState.spotDetails[action.payload.id] = {...action.payload}
        return newState
    }
    case MY_SPOTS: {
        const mySpots = {...state.mySpots}
        console.log(action)
        mySpots[action.payload.id] = {...action.payload}
        return {...state, mySpots: action.payload.Spots}
    }
    case NEW_SPOT: {
        console.log(action)
        if (!state[action.id]) {
            const newState = {
                ...state,
                [action.id]: action
            }
            return newState
        }
        return {...state}
    }
    case REMOVE_SPOT: {
        const id = action.payload;
        const newState = {...state };
        delete newState[id];
        return {newState}
    }
    default:
      {
        return state;
    }
  }
};

export default spotsReducer

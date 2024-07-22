import * as spotActions from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css';

function DeleteSpotModal({spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal()
    console.log(spotId)

    const handleSubmit = () => {
        dispatch(spotActions.deleteSpot(spotId))
        .then(() => {
            dispatch(spotActions.fetchSpots())
        })
        .then(() => {
            dispatch(spotActions.fetchMySpots())
        })
        .then(() => {
            closeModal()
        })
    }
    const handleCancel = () => {
        closeModal()
    };

    return (
        <>
        <h1>Confirm Delete</h1>
        <h2>Are you sure you want to remove this spot from the listings?</h2>
        <form>
        <div style={{textAlign:'center'}}>
        <div>
        <button style={{backgroundColor:'red', color:'#fff',border:'none', width:150}}
        type="button" onClick={handleSubmit}>Yes (Delete Spot)</button>
        </div>
        <div>
        <button style={{backgroundColor:'grey', color:'#fff',border:'none', width:150}}
        type="button" onClick={handleCancel}>No (Keep Spot)</button>
        </div>
        </div>
        </form>
        </>
    )
}

export default DeleteSpotModal;

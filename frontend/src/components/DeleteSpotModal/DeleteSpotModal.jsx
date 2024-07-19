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
        <button type="button" onClick={handleSubmit}>Yes (Delete Spot)</button>
        <button type="button" onClick={handleCancel}>No (Keep Spot)</button>
        </form>
        </>
    )
}

export default DeleteSpotModal;

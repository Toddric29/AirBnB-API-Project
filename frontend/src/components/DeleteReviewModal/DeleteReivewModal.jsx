import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';

function DeleteReviewModal({reviewId, spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal()
    console.log(reviewId)
    console.log(spotId)

    const handleSubmit = () => {
        dispatch(reviewActions.fetchDeleteReview(reviewId))
        .then(() => {
            dispatch(spotActions.fetchSpots(spotId))
        })
        .then(() => {
            dispatch(spotActions.fetchSpotDetails(spotId))
        })
        .then(() => {
            dispatch(reviewActions.fetchReviews(spotId))
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
        <h2>Are you sure you want to delete this review?</h2>
        <form>
        <div style={{textAlign:'center'}}>
        <div>
        <button style={{backgroundColor:'red', color:'#fff',border:'none', width:150}}
        type="button" onClick={handleSubmit}>Yes (Delete Review)</button>
        </div>
        <div>
        <button style={{backgroundColor:'grey', color:'#fff',border:'none', width:150}}
        type="button" onClick={handleCancel}>No (Keep Review)</button>
        </div>
        </div>
        </form>
        </>
    )
}

export default DeleteReviewModal;

import { useState } from 'react';
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
        <h2>Are you sure you want to rdelete this review?</h2>
        <form>
        <button type="button" onClick={handleSubmit}>Yes (Delete Review)</button>
        <button type="button" onClick={handleCancel}>No (Keep Review)</button>
        </form>
        </>
    )
}

export default DeleteReviewModal;

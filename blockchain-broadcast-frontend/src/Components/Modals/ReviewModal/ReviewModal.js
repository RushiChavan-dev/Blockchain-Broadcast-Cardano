import './ReviewModal.css';

const ReviewModal = props => {
  if (!props.show) {
    return null;
  }

  return (
    <div className="review-modal" onClick={props.onClose}>
      <div className="review-modal-content" onClick={e => e.stopPropagation()}>
        <div className="review-modal-body">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

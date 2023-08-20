import './BookCoverModal.css';

const BookCoverModal = props => {
  if (!props.show) {
    return null;
  }

  return (
    <div className="modal" onClick={props.onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
        </div>
        <div className="modal-body">
          {props.children}</div>
        <button onClick={props.onClose} className="close"></button>
      </div>
    </div>
  );
};

export default BookCoverModal;

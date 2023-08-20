import React from 'react';
import './OrderItem.css';
import { Link } from 'react-router-dom';


const OrderItem = ({ _id, imageUrl, title, authorName, purchaseDate,chapters}) => {
    console.log("test Chanpter")
    console.log(chapters)
    
    return (
        <Link to={`/order/${_id}?title=${title}`} className="item-link">
        <div className="item" style={{ }} >
            <img src={imageUrl} alt={title} className="item-image" />
                <div className="item-details">
                    <h2 className="item-title">{title}</h2>
                    <p className="item-author">By: {authorName}</p>
                    <p className="item-date">Purchased on: {purchaseDate}</p>
                    <p className="item-date">Start Page: {chapters.startpage}</p>
                    <p className="item-date">End Page: {chapters.endpage}</p>
                </div>
        </div>

        </Link>
    );
};


const OrderItemList = ({ items }) => {
    return (
        <div className="item-list" style={{ marginLeft:'20px', marginRight:'20px' }}>
            {items.map(item => <OrderItem key={item.id} {...item} />)}
        </div>
    );
};

export default OrderItemList;

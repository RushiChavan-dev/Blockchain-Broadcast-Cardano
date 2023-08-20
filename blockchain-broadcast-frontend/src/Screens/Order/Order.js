import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ListContent from '../../Components/Browsing/ListContent';
import OrderItemList from '../../Components/Order/OrderItemList';

import "./Order.css";


const items = [
  {
      id: 1,
      image: 'https://path.to/image1.jpg',
      title: 'Item Title 1',
      author: 'John Doe',
      purchaseDate: '2023-01-15'
  },
  {
      id: 2,
      image: 'https://path.to/image2.jpg',
      title: 'Item Title 2',
      author: 'Jane Smith',
      purchaseDate: '2023-02-10'
  }

];






// Assuming you have the following utility function
async function fetchData(url, token) {
  try {
      const response = await fetch(url, {
          method: 'GET',
          headers: {
              'x-auth-token': token,  // Assuming you're using token authentication
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      return await response.json();
  } catch (error) {
      console.error("There was a problem with the fetch operation:", error.message);
      // Handle this error in a way suitable for your frontend
  }
}

// Use the utility function to get purchased book details
async function getPurchasedDetails() {
  const token = localStorage.getItem('token');
  const url = 'http://localhost:4000/purchased-details';  // The endpoint we created
  const data = await fetchData(url, token);
  console.log(data); // This will log the fetched purchase details
}

// You can then call this function wherever you need the, purchased details



const Order = () => {


  const [currentUserObjectId, setCurrentUserObjectId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    (async () => {
      try {
      	const form_data = new FormData();
		const token = localStorage.getItem('token');

		const url = '/.netlify/functions/get-personal-info';

        const data = await fetch(url, {
          method: 'POST',
          headers: {
            'x-auth-token': token,
          },
          body: form_data,
        }).then((res) => res.json());
        console.log(` ${data._id} and more ${data} ` )
        setCurrentUserObjectId(data._id);

      const userId = data._id;
      const title = data.title
  
        if(!userId) {
            throw new Error('User ID not found.');
        }
  
        console.log(`User id is ${userId}`)
       
        const ordersUrl = `http://localhost:4000/orders/purchased-details?userId=${userId}`;
  
        const ordersResponse = await fetch(ordersUrl, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            },
        });
  
        if (!ordersResponse.ok) {
            throw new Error('Failed to fetch order details.');
        }
  
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
        console.log("This is order list")
        console.log(orders)
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  
  if (isLoading) {
      return <div>Loading...</div>;
  }
  
  if (error) {
      return <div>Error: {error}</div>;
  }
  
  // ... render your component as necessary ...
  

  return (
    <>
    {  console.log("ORDER PAGE")}
     {console.log(orders)}
    <h1>.</h1>
  
    <OrderItemList items={orders} style={{ width: '80%' }} />

    </>
  );
};

export default Order;

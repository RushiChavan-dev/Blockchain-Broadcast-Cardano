// Third-party imports
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BigNumber from 'bignumber.js';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Redux actions
import { addToCart, removeFromCart } from "../../Redux/actions/cartActions";
import { addToWishlist, removeFromWishlist } from "../../Redux/actions/wishlistActions";

// Component imports
import CartItem from "../../Components/Cart/CartItem/CartItem";
import Notification from "../../Components/Cart/UI/Notification";
import ConfirmDialog from "../../Components/Cart/UI/ConfirmDialog";
import SignInFirstDialog from "../../Components/Cart/UI/SignInFirstDialog";
import SavedItem from "../../Components/Cart/SavedItem/SavedItem";
import Carousel from "../../Components/Carousel/Carousel";

// Contexts and utilities
import { LucidContext } from '../../helper/LucidContext';

// Styles
import "./CartScreen.css";

const CartScreen = (props) => {
  // Contexts and States
  const lucid = useContext(LucidContext);
  const [walletAddress, setWalletAddress] = useState(null);
  const [lovelaceToSend, setLovelaceToSend] = useState(5000);
  let tnxHash;

  

  
  useEffect(() => {

     // Define an async function within the useEffect
      const fetchData = async () => {
        await getAddress();
      };


    // Now invoke the async function
    fetchData();

   }, []);


  const getAddress = async () => {
    if (!lucid || !lucid.wallet) {
      console.error("Lucid or lucid.wallet is not available");
      return;
    }
    
    const addr = await lucid.wallet.address();
    const utxos = await lucid.wallet.getUtxos(addr);
    console.log(addr);
    console.log(utxos.datum);
    setWalletAddress(addr);
  }

  const makePay = async () => {
    // Step 1: Fetch the cart total and set the Lovelace amount.
    const getTotal = await getCartSubTotal();
    const calculatedLovelace = getTotal * 1000000;
    setLovelaceToSend(calculatedLovelace);

    // Optional: If you want to ensure that setLovelaceToSend has completed 
    // before moving on (assuming it's an asynchronous function), you can 
    // await it if it returns a promise. If it's synchronous, you can skip this.
    // await setLovelaceToSend(calculatedLovelace);

    console.log(new BigNumber(calculatedLovelace));
    console.log(calculatedLovelace);

    // Step 2: Proceed with the transaction.
    const api = await window.cardano.nami.enable();
    lucid.selectWallet(api);

    const tx = await lucid.newTx()
        .payToAddress("addr_test1qqv94nr4azdf8lqjphxmtvgs56yux66h2nvm6z7nsdrlymgus4634jhw020htv6zxtjjc8at95pkrvd748wnnpvgnt4qqmqs7n", 
                      { lovelace: new BigNumber(calculatedLovelace) })
        .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    console.log(txHash);

    tnxHash = txHash;  // Make sure tnxHash is defined in an outer scope if you plan to use it later.
}


  async function callTestAPI() {
    try {
      // Call the /test endpoint
      const response = await fetch('http://localhost:4000/test'); 
  
      // Check if the call was successful
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Log the response or do something with the data
      console.log(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
    }
  }
  
 

  const verifypayment = async () => {
    try {
        const data = {
            txHash: tnxHash,
            lovelaceToSend: lovelaceToSend
        };
  
        const response = await fetch(`http://localhost:4000/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        if (result.isPaymentVerified) {
            console.log("Payment is verified.");
        } else {
            console.log("Payment is not verified.");
        }
    } catch (error) {
        console.error(`Failed to verify the payment: ${error.message}`);
    }
}



  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  // Signin First Dialog
  const [signInFirstDialog, setSignInFirstDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  // Notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '', typeStyle: '' });

  // Items saved for later
  const savedForLater = cartItems.filter(({ saved }) => saved === true);

  // Items in cart (not including saved for later)
  const inCart = cartItems.filter(({ saved }) => saved === false);

  // User token
  const token = localStorage.getItem('token') || false;

  // Collapsible
  const [colapse, setCollapse] = useState(false);

  // Change quantity of item
  const toggleCollapse = () => {
    setCollapse(!colapse);
  };

  // Change quantity of item
  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, qty, false));
  };

  // Save an item for later
  const saveForLaterHandler = (id, qty) => {
    dispatch(addToCart(id, qty, true));
  };

  // Add item from 'saved for later' to shopping cart
  const addBackToCartHandler = (id, qty) => {
    if ((savedForLater.length - qty) <= 0) { setCollapse(false); }
    dispatch(addToCart(id, qty, false));
  };

  // Remove an item from shopping cart and display message
  const removeFromCartHandler = (id, title) => {
    dispatch(removeFromCart(id));
    setNotify({
      isOpen: true,
      message: `"${title}" was removed from cart`,
      type: 'success',
      typeStyle: 'specific'
    });
  };

  // Add item to wishlist and display message
  const addToWishlistHandler = (id, title) => {
    dispatch(addToWishlist(id));
    setNotify({
      isOpen: true,
      message: `"${title}" was added to your wishlist`,
      type: 'success',
      typeStyle: 'specific'
    });
  };

  // Notify if an error occurs
  const errorHandler = (text) => {
    setNotify({
      isOpen: true,
      message: text,
      type: 'error',
    });
  };

  // Add item to wishlist, remove it from shopping cart, and display message
  const addCartItemToWishlistHandler = (id, title) => {
    addToWishlistHandler(id, title);
    dispatch(removeFromCart(id));
  };

  // Add item to wishlist, remove it from shopping cart, and display message
  const removeFromWishlistHandler = (id, title) => {
    dispatch(removeFromWishlist(id));
    setNotify({
      isOpen: true,
      message: `"${title}" was removed from your wishlist`,
      type: 'success',
      typeStyle: 'specific'
    });
  };


  
  const [currentUserObjectId, setCurrentUserObjectId] = useState(null);  // New state for the user's ObjectId

 
 
	const getDataPay = async () => {
		const form_data = new FormData();
		const token = localStorage.getItem('token');

		const url = '/.netlify/functions/get-personal-info';

		try {
			const data = await fetch(url, {
				method: 'POST',
				headers: {
					'x-auth-token': token,
				},
				body: form_data,
			}).then((res) => res.json());
      console.log(` ${data._id} and more ${data} ` )
			setCurrentUserObjectId(data._id);
		
		} catch (err) {
			// err ? err : 
			console.log(err ? err : 'Something unexpected happened. Please try again later')
			errorHandler(
				'Something unexpected happened. Please try again later'
			);
		}
	};

	useEffect(() => {
		getDataPay();
	}, []);

     
 

  const createOrder = async () => {
    try {
        const orderDetails = {
            items: inCart.map(item => ({
                productId: item.book,  // Assuming 'item.book' is the ObjectId of the product
                quantity: item.qty
            })),
            totalPrice: parseFloat(getCartSubTotal()),
            userId:   currentUserObjectId  // Fetch this from user's session, local storage, or any other relevant source
        };

        const response = await fetch('http://localhost:4000/orders/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

          const result = await response.json();
      
        if (result && result.orderId) {
          
            return result.orderId;  // Return the orderId
        } else {
            console.warn("Order ID was not received in the response");
            return null;
        }
        
       

    } catch (error) {
        console.error(`Failed to create order: ${error.message}`);
    }
};


// ============================================ 5. Endpoints Funcations ============================================


const fetchUploadData = async (bookidi) => {
  console.log(bookidi);
  const endpointUrl = `http://localhost:4000/upload`;

  try {
      const response = await fetch(endpointUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              // Any other headers required by your server
          },
          body: JSON.stringify({ book: bookidi.toString() }) // Send the book ID in the request body
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw error; // re-throw the error so you can catch it when calling the function
  }
};


const fetchGeneratedKeys = async () => {
  const endpointUrl = 'http://localhost:4000/generate-keys';

  try {
      const response = await fetch(endpointUrl, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              // Any other headers required by your server
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw error;
  }
};


const fetchUTXOData = async () => {
  const endpointUrl = 'http://localhost:4000/get-utxo';

  try {
      const response = await fetch(endpointUrl, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('There was a problem with the fetch operation:', error.message);
      throw error;
  }
};

async function createNFT(dataToPost) {
  try {
      const response = await fetch('http://localhost:4000/create-nft', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToPost),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
          throw new Error(responseData.error || 'Failed to create NFT.');
      }
      
      return responseData;
      
  } catch (error) {
      console.error('Error:', error.message);
      throw error;
  }
}


async function processBooks(incart,orderId) {
  // Usage
const randomStr = generateRandomString();


  for (const book of incart) {
      const dataToPost = {
        assetName: book.title, // Using book title as the asset name
        additionalId:randomStr, 
        httpUrl: "book cover",
        title: book.title,
        description: "book description",
        startPage: book.chapters.startpage,
        endPage: book.chapters.endpage,
        authorName: book.author.name,
        orderRefID: orderId  // Update as per requirement
          // Add any other fields you need
      };

      // Assuming `createNFT` is a function that you'd call to process dataToPost
      const responseData = await createNFT(dataToPost);
      return responseData;
      
      // Handle the responseData as needed
  }
}


/**
 * Call the NFT Draft Transaction API to get the transaction fee.
 * 
 * @param {number} minvalue - The minimum value for the transaction.
 * @param {number} minfee - The minimum fee for the transaction.
 * @param {string} destAddress - The destination address for the transaction.
 * @param {string} apiUrl - The base URL of the API.
 * 
 * @returns {Promise<number>} - A promise that resolves with the transaction fee.
 */
async function getNftTransactionFee(minvalue, minfee, destAddress) {
  const endpoint = `http://localhost:4000/build-nft-draft-transaction`;

  const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          minvalue: minvalue,
          minfee: minfee,
          destAddress: destAddress
      })
  });

  if (!response.ok) {
      throw new Error(`API returned with status: ${response.status}`);
  }

  const json = await response.json();
  return json.FEE;
}


/**
 * Call the Build Raw Transaction API to construct and submit a raw transaction.
 * 
 * @param {number} minvalue - The minimum value for the transaction.
 * @param {number} minfee - The minimum fee for the transaction.
 * @param {string} destAddress - The destination address for the transaction.
 * @param {string} apiUrl - The base URL of the API.
 * 
 * @returns {Promise<object>} - A promise that resolves with the response from the API.
 */
async function buildRawTx(minvalue, minfee, destAddress) {
  const endpoint = `http://localhost:4000/build-raw-tx`;

  const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          minvalue: minvalue,
          minfee: minfee,
          destAddress: destAddress
      })
  });

  if (!response.ok) {
      throw new Error(`API returned with status: ${response.status}`);
  }

  return await response.json();
}













// ============================================ 5. Payment confirmation and NFT creatation Funcations ============================================

const onContinue = async () => {
  try {
      // Step 1: Make the payment and ensure all its steps are completed.
      await makePay();

      // // Step 1.3: Fetch user details
     
      // // Step 1.5: Create the order immediately after successful payment
      let orderId = await createOrder();

      // Step 2: Checkout every book in cart, close dialog, and display success message.
      inCart.forEach((item) => checkout(item.book, item.qty));

      // console.log(orderId)
      // console.log(inCart[0].book)
    

      setConfirmDialog({
          ...confirmDialog,
          isOpen: false
      });

      setNotify({
          isOpen: true,
          message: 'Checkout completed successfully',
          type: 'success',
          typeStyle: ''
      });


      fetchUploadData(inCart[0].book)
    .then(response1 => {
        console.log("Response from fetchUploadData:", response1);

        return fetchGeneratedKeys()
            .then(response2 => {
                console.log("Response from fetchGeneratedKeys:", response2);

                return fetchUTXOData()
                    .then(response3 => {
                        console.log("Response from fetchUTXOData:", response3);

                        return processBooks(inCart,orderId)
                            .then(response4 => {
                                console.log("Response from createNFT:", response4);

                                return getNftTransactionFee(1, 0, walletAddress)
                                    .then(response5 => {
                                        console.log("Response from getNftTransactionFee:", response5);

                                        return buildRawTx(2900000, 208741, walletAddress)
                                            .then(response6 => {
                                                console.log("Response from buildRawTx:", response6);

                                                return getTxId();
                                            })
                                            .then(response7 => {
                                                console.log("Transaction ID:", response7.txid);  // Assuming the response contains a 'txid' property
                                            });
                                    });
                            });
                    });
            });
    })
    .catch(error => {
        console.error("Error in one of the steps:", error);
    });



      // Assuming all the functions return promises

          // fetchUploadData()
          // .then(response1 => {
          //     console.log("Response from fetchUploadData:", response1);
          //     return fetchGeneratedKeys()
          // })
          // .then(response2 => {
          //     console.log("Response from fetchGeneratedKeys:", response2);
          //     return fetchUTXOData();
          // })
          // .then(response3 => {
          //     console.log("Response from fetchUTXOData:", response3);
          //     return processBooks(inCart);
          // })
          // .then(response4 => {
          //     console.log("Response from createNFT:", response4);
          //     return getNftTransactionFee(1, 0, walletAddress);
          // })
          // .then(response5 => {
          //     console.log("Response from getNftTransactionFee:", response5);
          //     return buildRawTx(2900000, 208741, walletAddress);
          // })
          // .then(response6 => {
          //     console.log("Response from buildRawTx:", response6);
          //         const resultTnx  = getTxId()
          //           .then(response => {
          //               console.log("Transaction ID:", response.txid);  // Assuming the response contains a 'txid' property
          //           })
          //           .catch(error => {
          //               console.error("Error:", error);
          //           });
          //         console.log(resultTnx)
          // })
          // .catch(error => {
          //     console.error("Error in one of the steps:", error);
          // });



     
      
          // const resultFetchUpload = () => {
          //     fetch('http://localhost:3000/upload')
          //     .then(response => {
          //       console.log(response)
          //       response.json()
          //     }) 
          //     .then(data => {
          //       console.log(data)
          //     })
          //     .catch(error => {
                  
          //        console.log(error);
          //     });
          // };


      // const resultFetchUpload = await fetchUploadData();
      // console.log("---------------------------------------------")
      // console.log(resultFetchUpload)
      // const resultGenratedKeys = await fetchGeneratedKeys();
      // const resultFetchUTXOData = await fetchUTXOData();
              // Assuming you're fetching from a web browser
      // const resultCreateNFT = processBooks(inCart)

      // Example usage:

      


      // const responseData = await createNFT(dataToPost);

      // const resultDraftTnx = getNftTransactionFee(1, 0, walletAddress)
      //   .then(fee => {
      //       console.log("Fee:", fee);
      //   })
      //   .catch(error => {
      //       console.error("Error:", error);
      //   });

      // Example usage:
    
      //   const resultbuildRaw  = buildRawTx(2900000, 210741, walletAddress)
      //   .then(response => {
      //       console.log(response);
      //       if (response.success) {
      //           console.log(response.message);
      //       } else {
      //           console.error("Error:", response.error);
      //       }
      //   })
      //   .catch(error => {
      //       console.error("API call failed:", error);
      //   });


      //   const resultTnx  = getTxId()
      //   .then(response => {
      //       console.log("Transaction ID:", response.txid);  // Assuming the response contains a 'txid' property
      //   })
      //   .catch(error => {
      //       console.error("Error:", error);
      //   });
      //  console.log(resultTnx)
   
    


      // Optionally, you can call the verifypayment method here if you want 
      // it to run in the background without waiting for it.
      // verifypayment();

  } catch (error) {
      // Handle any errors that might occur in any of the steps above.
      console.error("Error during checkout:", error);

      setNotify({
          isOpen: true,
          message: 'Checkout failed. Please try again.',
          type: 'error',
          typeStyle: ''
      });
  }
};

/**
 * Call the Get TxId API to fetch the transaction ID.
 * 
 * @returns {Promise<object>} - A promise that resolves with the response from the API.
 */
async function getTxId() {
  const endpoint = 'http://localhost:4000/get-txid';

  const response = await fetch(endpoint);

  if (!response.ok) {
      throw new Error(`API returned with status: ${response.status}`);
  }

  return await response.json();
}




  // Update sold count of book and remove it from cart
  const checkout = (id, qty) => {
    // TODO: Database update: add books to user's purchased books
    try {
      const url = `/.netlify/functions/purchase-book/?id=${id}&qty=${qty}`;
      fetch(url, {
        method: 'PATCH'
      }).then((res) => {
        dispatch(removeFromCart(id));
      });
    } catch (err) {
      errorHandler(
        err ? err : 'Something unexpected happened. Please try again later'
      );
    }
  };

  // Checkout all books in cart and display success message
  const checkoutHandler = () => {
    token ?
      setConfirmDialog({
        isOpen: true,
        title: 'Are you sure you want to checkout?',
        subTitle: "You can't undo this operation",
        onContinue: () => { onContinue(); }
      }) :
      setSignInFirstDialog({
        isOpen: true,
        title: 'You are not signed in',
        subTitle: 'Please sign in before checkout',
      });
  };

  // Get number of items in shopping cart
  const getCartCount = () => {
    return inCart.reduce((qty, item) => Number(item.qty) + qty, 0);
  };

  // Get subtotal
  const getCartSubTotal = () => {
    return inCart
      .reduce((price, item) => price + item.price * item.qty, 0)
      .toFixed(2);
  };


  const [, setActiveIndex] = useState(0);
  const offset = 4;

  const handleUpdateIndexCallback = (newIdx) => {
    const newIndex = newIdx;
    setActiveIndex(newIndex);
  };
  
  function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 7) + 1; // Generates a number between 1 and 7
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}



  return (
    <>
     

      <div className="nav-bottom" style={{ display: getCartCount() === 0 && 'none' }}>
        <div className="right-subtotal">
          <div className="right-subtotal-text">
            <div className="subtotal-description">
              ORDER TOTAL
            </div>
            <div className="subtotal">&emsp;&emsp;${getCartSubTotal()}
            </div>
          </div>
          <div></div>
          <button onClick={() => checkoutHandler()} className="btn btn-primary btn-checkout" disabled={getCartCount() === 0}>
            CONTINUE TO CHECKOUT
          </button>
        </div>
      </div>
      <div className="nav-bottom" style={{ display: getCartCount() !== 0 && 'none' }}>
        <div className="right-subtotal">
          <Link to="/browse">
            <div className="btn btn-primary btn-checkout">
              CONTINUE SHOPPING
            </div>
          </Link>
          {
            !token &&
            <>
              <div></div>
              <Link to="/auth">
                <div className="btn btn-light btn-checkout">
                  SIGN IN
                </div>
              </Link>
            </>}
        </div>
      </div>
      <div className="cartscreen">
        {inCart.length !== 0 &&
          <div className="centered_header">
            Shopping Cart
          </div>}
        <div className={`checkout-content ${inCart.length === 0 ? "" : "checkout-content-non-empty"}`}>


          {inCart.length === 0 ?
            (<>
              <div className="cartscreen__center">
                <div className="cart_message">
                  <div className="cart_upper_message">
                    <p>Your cart is empty.</p>
                  </div>
                  <div className="cart_bottom_message">
                    <p>Add some books and get free shipping on orders of $40+.</p>
                  </div>

                  <Link to="/browse" className="btn-browse non_collapsible_items">
                    <div className="btn btn-primary btn-checkout">
                      START SHOPPING
                    </div>
                  </Link>
                </div>

              </div>
            </>)
            :
            (<div className={`cartscreen__info ${!colapse && "not-collapsed-content"}`}>
              {inCart.map((item, i) => (

                <div key={item.book}>

                  <CartItem
                    key={item.book}
                    item={item}
                    qtyChangeHandler={qtyChangeHandler}
                    removeHandler={removeFromCartHandler}
                    addToWishlistHandler={addCartItemToWishlistHandler}
                    saveForLaterHandler={saveForLaterHandler}
                    addBackToCartHandler={addBackToCartHandler}
                    saved={false}
                    bookId={item.book}
                  />
                  {i < inCart.length - 1 && <hr />}
                </div>
              ))}

            </div>)
          }

          {savedForLater.length > 0 &&

            <div className="non_collapsible_items">

              <div className="saved-header" onClick={() => toggleCollapse()}>

                <h3>Saved for Later ({savedForLater.length} item{savedForLater.length > 1 && "s"})</h3>
              </div>
              <div className="carousel-container-cart">
                <Carousel
                  offset={offset}
                  handleUpdateIndexCallback={handleUpdateIndexCallback}
                  totalLength={savedForLater.length}
                >
                  {savedForLater.map((item) => (
                    <div
                      key={item.book}
                      className="carousel-item"
                    >
                      <SavedItem
                        key={item._id}
                        title={item.title}
                        price={item.price}
                        rating={item.rating}
                        cover={item.cover}
                        book={item.book}
                        qty={item.qty}
                        authorId={item.author._id}
                        authorName={item.authorName}
                        releaseDate={item.releaseDate}
                        addToWishlistHandler={addToWishlistHandler}
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        addBackToCartHandler={addBackToCartHandler}
                        removeHandler={removeFromCartHandler}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>}
        </div>
        {
          inCart.length !== 0 &&
          <div className="top-subtotal">
            <h2>
              Order Summary
            </h2>
            <div className="summary-subsection">
              <div className="flex-section">
                <div>
                  Subtotal ({getCartCount()} {getCartCount() === 1 ? <>item</> : <>items</>})
                </div>
                <div >
                  ADA {getCartSubTotal()}
                </div>
              </div>
              <div className="flex-section">
                <div>
                  Estimated Shipping
                </div>
                <div >
                  ADA 0.00
                </div>
              </div>
              <div className="flex-section">
                <div>
                  Estimated Tax
                </div>
                <div >
                  ADA 0.00
                </div>
              </div>
            </div>
            <hr />
            <div className="flex-section">
              <div>
                <b>Order Total</b>
              </div>
              <div >
                <b>ADA {getCartSubTotal()}</b>
              </div>
            </div>

            <button onClick={() => checkoutHandler()} className="btn btn-primary btn-checkout btn-checkout-top" disabled={getCartCount() === 0}>
              CHECKOUT
            </button>
            {
              !token &&
              <Link to="/auth">
                <button className="btn btn-light btn-checkout btn-checkout-top" disabled={getCartCount() === 0}>
                  LOG IN
                </button>
              </Link>
            }
          </div>}
        {savedForLater.length !== 0 &&
          <>
            <div className="collapsible_items">
              <div className={`centered_saved collapsible_header ${!colapse && "not-collapsed-header"}`}
                onClick={() => toggleCollapse()}
              >
                Saved for Later ({savedForLater.length})
                {colapse ?
                  <RemoveIcon />
                  :
                  <AddIcon />
                }
              </div>
              {colapse &&
                <div className="cartscreen__info_saved collapsible_content">
                  {savedForLater.map((item, i) => (
                    <div key={item.book}>
                      <CartItem
                        key={item.book}
                        item={item}
                        qtyChangeHandler={qtyChangeHandler}
                        removeHandler={removeFromCartHandler}
                        addToWishlistHandler={addToWishlistHandler}
                        removeFromWishlistHandler={removeFromWishlistHandler}
                        saveForLaterHandler={saveForLaterHandler}
                        addBackToCartHandler={addBackToCartHandler}
                        saved={true}
                        bookId={item.book}
                      />
                      {i < savedForLater.length - 1 && <hr />}
                    </div>
                  )
                  )}
                </div>
              }

            </div>
          </>
        }



{/* 10,000.000000 t₳
2,935.94 $ */}

{/* TxHash                                 TxIx        Amount
--------------------------------------------------------------------------------------
d39f8f77393e52b7b8e9e94cb21269cff8c972551e74a7d929d36a72acd406b3     1        9997922467 lovelace + TxOutDatumNone
root@146c563b3ec5:~#  */}
{/* 100000 = 1 ada = one lakh means one ada */}
        {/* <button onClick={makePay}> PAY NOW</button>
        <p> This is the address details</p>
        {walletAddress }
        <button onClick={verifypayment}> Verify</button> */}





        <div className={`shaded_section ${!colapse && "not-collapsed-shaded_section"}`}>
          <div className="shaded_subsection">
            <div >
              Subtotal ({getCartCount()} {getCartCount() === 1 ? <>item</> : <>items</>})
            </div>
            <div >
              ${getCartSubTotal()}
            </div>
          </div>
          <div className="shaded_subsection">
            <div>
              Estimated Shipping
            </div>
            <div >
              ADA 0.00
            </div>
          </div>
          <div className="shaded_subsection">
            <div>
              Estimated Tax
            </div>
            <div >
              ADA 0.00
            </div>
          </div>
        </div>
      </div>
     
      <Notification
        notify={notify}
        setNotify={setNotify}
      />
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <SignInFirstDialog
        signInFirstDialog={signInFirstDialog}
        setSignInFirstDialog={setSignInFirstDialog}
      />


    
    </>
  );
};

export default CartScreen;

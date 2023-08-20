import React, { useEffect, useState, useContext } from "react";
import PDFViewer from '../../helper/PDFViewer';
import { LucidContext } from '../../helper/LucidContext';
import { Json } from "lucid-cardano";
import { useLocation } from 'react-router-dom';

const OrderDetails = (props) => {
    let title;

    const location = useLocation();
    const rawTitle = new URLSearchParams(location.search).get('title');
    const orderId = props.match.params.id; 

    if (rawTitle) {
        console.log(rawTitle)
        title = rawTitle;
    } else {
        console.log("Title not found in the query parameters");
    }

    const [numPages, setNumPages] = useState<number>(0);
    const lucid = useContext(LucidContext);
    const [walletAddress, setWalletAddress] = useState(null);
    const [assetMetadata, setAssetMetadata] = useState<Json[]>([]);
    const [startPage, setStartPage] = useState<number | null>(null);
    const [endPage, setEndPage] = useState<number | null>(null);

    const fetchTxMetadata = async (txHash) => {
        const network = 0;
        const apiKey = "preprod0nmqzrUnd4dQFb4U371gLO6iGYkxWaXK";
        const endpoint = `https://cardano-preprod.blockfrost.io/api/v0/txs/${txHash}/metadata`;
    
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'project_id': apiKey
            }
        });
        return await response.json();
    }

    const getAddress = async () => {
        if (!lucid || !lucid.wallet) {
            console.error("Lucid or lucid.wallet is not available");
            return;
        }
        
        const addr = await lucid.wallet.address();
        const utxos = await lucid.wallet.getUtxos(addr);
        setWalletAddress(addr);

        const txHashes = utxos.map(utxo => utxo.txHash);

        for (const txHash of txHashes) {
            try {
                const metadata = await fetchTxMetadata(txHash);

                if (metadata && metadata.length > 0) {
                    const metaData = metadata[0];
                    const keys = Object.keys(metaData.json_metadata);
                    const firstKey = keys[0];
                    const innerObject = metaData.json_metadata[firstKey];

                    const bookKeys = Object.keys(innerObject);
                    const firstBookKey = bookKeys[0];
                    const bookDetails = innerObject[firstBookKey];

                    const orderRef = bookDetails.orderRef;

                    if (orderRef === orderId) {
                        console.log("Check Order")
                        setStartPage(bookDetails.startPage);
                        setEndPage(bookDetails.endPage);
                    }
                }

                setAssetMetadata(prevMetadata => [...prevMetadata, ...metadata]);
            } catch (error) {
                console.error(`Error fetching metadata for txHash: ${txHash}`, error);
            }
        }
    }

    useEffect(() => {
        getAddress();
    }, [lucid]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div id="layout-container" style={{ opacity: 1, display: 'block', width: '718px', height: '100vh', top: '45px', transform: 'scale(1) translate(373px, 0px)' }}>
            {startPage && endPage && <PDFViewer startPage={startPage} endPage={endPage} title={title}/>}
        </div>
    );
};

export default OrderDetails;


        // console.log(txHashes);
    
        // const assetIDs = utxos.flatMap(utxo => 
        //     Object.keys(utxo.assets).filter(assetKey => assetKey !== 'lovelace')
        // );
        
        // console.log("Extracted Asset IDs:", assetIDs);
    
        // await fetchMetadataForAssetIDs(assetIDs);
        // await fetchMetadataForTxHashes(txHashes);

    
        // Fetch UTxOs based on each assetID
        // for (const assetID of assetIDs) {
        //     try {
        //         const utxosForAsset = await lucid.utxosAtWithUnit(addr, assetID);
        //         console.log(`UTxOs for Asset ID ${assetID}:`, utxosForAsset);
        //     } catch (error) {
        //         console.error(`Error fetching UTxOs for Asset ID: ${assetID}`, error);
        //     }
        // }


    //     // Fetch datum for each UTxO
    // for (const utxo of utxos) {
    //     try {
    //         const datum = await lucid.datumOf(utxo);
    //         console.log(`Datum for UTxO with txHash ${utxo.txHash}:`, datum);
    //     } catch (error) {
    //         console.error(`Error fetching datum for UTxO with txHash: ${utxo.txHash}`, error);
    //     }
    // }

        
        // console.log("------------------------------------");
        // console.log({utxos});


    
    // // useless
    // const fetchMetadataForAssetIDs = async (assetIDs) => {
    //     for (const assetID of assetIDs) {
    //         try {
    //             const metadata = await lucid.metadataOf(assetID);
    //             console.log(`Metadata for Asset ID ${assetID}:`, metadata);
    //         } catch (error) {
    //             console.error(`Error fetching metadata for Asset ID: ${assetID}`, error);
    //         }
    //     }
    // }

    // // useless
    // const fetchMetadataForTxHashes = async (txHashes) => {
    //     for (const txHash of txHashes) {
    //         try {
    //             const metadata = await lucid.metadataOf(txHash);
    //             console.log(`Metadata for Transaction Hash ${txHash}:`, metadata);
    //         } catch (error) {
    //             console.error(`Error fetching metadata for Transaction Hash: ${txHash}`, error);
    //         }
    //     }
    // }
    




    // return (
    //     <div id="layout-container" style={{ opacity: 1, display: 'block', width: '718px', height: '100vh', top: '45px', transform: 'scale(1) translate(373px, 0px)' }}>
    //         <Document
    //             file={samplePDF}
    //             onLoadSuccess={onDocumentLoadSuccess}
    //         >
    //             {Array.from(new Array(numPages), (el, index) => (
    //                 <div 
    //                     key={`page_${index}`} 
    //                     id={`pagediv_${index}`} 
    //                     className="pagerect" 
    //                     style={{
    //                         left: '5px',
    //                         top: `${index * 876 + 3}px`,
    //                         width: '708px',
    //                         height: '876px',
    //                         boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    //                         margin: '16px',
    //                         border: '1px solid black',
    //                     }}
    //                 >
    //                     <Page pageNumber={index + 1} />
    //                 </div>
    //             ))}
    //         </Document>
    //     </div>
    // );





// import React, { useState } from 'react';
// import { pdfjs, Document, Page } from 'react-pdf';

// // Import the PDF file from the root directory
// import samplePDF from '../../sample.pdf';

// // Set up worker for react-pdf
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const OrderDetails = (props) => {
//     const [numPages, setNumPages] = useState<number>();
//     const [pageNumber, setPageNumber] = useState<number>(5);

//     function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//         setNumPages(numPages);
//     }
    
//     const orderId = props.match.params.id; // Get the order ID from the URL

//     return (
//         <div style={{ marginTop:'6vh', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
//             <div style={{ border: '1px solid black', marginBottom: '16px' }}>
//                 <Document
//                     file={samplePDF}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                 >
//                     <div style={{ boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)', margin: '16px' }}>
//                         <Page pageNumber={pageNumber} />
//                     </div>
//                 </Document>
//             </div>

//             {numPages && (
//                 <div>
//                     <button onClick={() => setPageNumber(Math.max(1, pageNumber - 1))} disabled={pageNumber <= 1}>
//                         Previous
//                     </button>
//                     <span style={{ margin: '0 10px' }}>
//                         Page {pageNumber} of {numPages}
//                     </span>
//                     <button onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))} disabled={pageNumber >= numPages}>
//                         Next
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default OrderDetails;



// // const OrderDetails = (props) => {
// //     const [orderDetails, setOrderDetails] = useState(null);
// //     const [isLoading, setIsLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const [numPages, setNumPages] = useState<number>();
// //     const [pageNumber, setPageNumber] = useState<number>(1);

// //     function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
// //         setNumPages(numPages);
// //       }
    
// //     const orderId = props.match.params.id;  // Get the order ID from the URL

// //     console.log(orderId)
// //     console.log(process.env.PUBLIC_URL)
// //     // useEffect(() => {
// //     //     const fetchOrderDetails = async () => {
// //     //         try {
// //     //             const response = await fetch(`http://localhost:4000/order/${orderId}`);
                
// //     //             if (!response.ok) {
// //     //                 throw new Error('Failed to fetch order details.');
// //     //             }

// //     //             const data = await response.json();
// //     //             setOrderDetails(data);

// //     //         } catch (err) {
// //     //             setError(err.message);
// //     //         } finally {
// //     //             setIsLoading(false);
// //     //         }
// //     //     };

// //     //     fetchOrderDetails();
// //     // }, [orderId]);

// //     // if (isLoading) {
// //     //     return <div>Loading...</div>;
// //     // }

// //     // if (error) {
// //     //     return <div>Error: {error}</div>;
// //     // }

// //     // if (!orderDetails) {
// //     //     return <div>No order details found.</div>;
// //     // }

// //     return (
// //         // <div className="order-details">
// //         //     <h2>Order Details for ID: {orderId}</h2>
// //         //     <img src={orderDetails.image} alt={orderDetails.title} />
// //         //     <p>Title: {orderDetails.title}</p>
// //         //     <p>Author: {orderDetails.author}</p>
// //         //     <p>Purchase Date: {orderDetails.purchaseDate}</p>
// //         //     {/* Add more details as needed */}
// //         // </div>
// //         <>
// //            <div>
// //       <Document file={`./sample.pdf`}>
// //         <Page pageNumber={1} />
// //       </Document>
// //     </div>
        
// //         </>
// //     );
// // };


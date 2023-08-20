// ============================================ 1. Import Statements ============================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import multer from "multer";
import bodyParser from "body-parser";

import { spawn, exec } from "child_process";
import { promisify } from "util";


import AuthRoute from './routes/users.js';
import booksRouter from './routes/books.js';
import genresRouter from './routes/genres.js';
import authorsRouter from './routes/authors.js';
import AccountManager from './routes/AccountManager/AccountManger.js';
import orderRoute from './routes/orders.js';

import LoggingCredentials from './routes/LoggingCredentials/LoggingCredentialsManager.js';
import pinataSDK from '@pinata/sdk';


import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// ============================================ 2. Initialization ============================================
dotenv.config();
const server = express();


const baseUrlIPFS = `https://milkomeda-testnet.blockfrost.io/api/v0/`;
const projectId = ' blockfrost projectId';
const filePath = './new_2.png';

// Use the api keys by specifying your api key and api secret

const pinata = new pinataSDK({ pinataApiKey: 'pinataApiKey', pinataSecretApiKey: 'pinataSecretApiKey' });
const res = await pinata.testAuthentication()
console.log(`"Congratulations! You are communicating with the Pinata API"! ${res}`)

// ============================================ 3. Middlewares ============================================
server.use(cors());
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// TODO: This is for file selected upload
// const upload = multer({ dest: 'uploads/' });
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/') // set the destination
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname) // set the file name to be the original name of the file
  }
});

const upload = multer({ storage: storage });




// Set the environment variable
process.env.CARDANO_NODE_SOCKET_PATH = `${process.env.HOME}/cardano-node/cardano-testnet/db/node.socket`;
// Modify the PATH environment variable
process.env.PATH += '/root/.local/bin';
process.env.PATH += '/root/.local/bin:/root/.local/bin/cardano-cli';
process.env.PATH += '/root/.local/bin/cardano-cli';
const cmd = '/root/.local/bin/cardano-cli';
// ... your other Node.js code ...


// Print the path
console.log("CARDANO_NODE_SOCKET_PATH:", process.env.CARDANO_NODE_SOCKET_PATH);


server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

server.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  //res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});




// ============================================ 0. Variables ============================================



let cachedKeys = null;  // In-memory storage (temporary)

// Global variable to hold UTXO details
let cachedUTXODetails = null;
let expiresAtSlot = null;
let buildFEE = null;
let imageId ;
let nftStructure;
let createasset_name;







// ============================================ 4. Utility Functions ============================================
const execAsync = promisify(exec);

// Function to upload the file to IPFS
async function uploadFileToIPFS() {
    const addUrl = '/add';
    const fileBuffer = fs.readFileSync(filePath);
    const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', fileBlob, 'cp5.png');
    const headers = {
        'project_id': projectId,
    };
    const response = await fetch(baseUrlIPFS + addUrl, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    const responseData = await response.json();
    const pinToIPFs = await pinToIPFS(responseData.ipfs_hash);
    return responseData.ipfs_hash;
}

// PIN To IPFS Function
async function pinToIPFS(cid) {
    const pinUrl = `/pin/add/${cid}?cacheBust=${Date.now()}`;
    const headers = {
        'project_id': projectId,
    };
    try {
        const response = await fetch(baseUrlIPFS + pinUrl, {
            method: 'POST',
            headers: headers,
        });
        if (!response.ok) {
            throw new Error('Failed to pin to IPFS.');
        }
        const responseData = await response.json();
        console.log('Pin response:', responseData);
    } catch (error) {
        console.error('Error pinning to IPFS:', error.message);
    }
}

async function uploadFunction(imageFile) {
    const addUrl = '/add';
    const fileBuffer = fs.readFileSync(imageFile.path);
    const fileBlob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', fileBlob, imageFile.originalname);
    const headers = {
        'project_id': projectId,
    };
    const response = await fetch(baseUrlIPFS + addUrl, {
        method: 'POST',
        headers: headers,
        body: formData,
    });
    const responseData = await response.json();
    const pinToIPFs = await pinToIPFS(responseData.ipfs_hash);
    
    return responseData.ipfs_hash;
}


async function uploadFileToPindata(imageFilePath , customName, customValues = {}) {
  // Create a readable stream for the provided file path
  const readableStreamForFile = fs.createReadStream(imageFilePath);
 

  const options = {
      pinataMetadata: {
          name: customName,
          keyvalues: customValues
      },
      pinataOptions: {
          cidVersion: 0
      }
  };

  try {
      const res = await pinata.pinFileToIPFS(readableStreamForFile, options);
      console.log(res);
      return res;
  } catch (error) {
      console.error('Error uploading file to Pinata:', error.message);
      throw error;
  }
}


async function executeCommand(command) {
    try {
        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            throw new Error(`Command execution error: ${stderr}`);
        }
        return stdout.trim();
    } catch (error) {
        console.error(`Error executing command: ${command}\n${error}`);
        throw new Error('Internal server error');
    }
}

async function generateKeys() {
    const verificationKeyFile = 'nft-policy.vkey';
    const signingKeyFile = 'nft-policy.skey';
    const command = `${cmd} address key-gen --verification-key-file ${verificationKeyFile} --signing-key-file ${signingKeyFile}`;
    await executeCommand(command);
    const policyKeyHashOutput = await executeCommand(`${cmd} address key-hash --payment-verification-key-file ${verificationKeyFile}`);
    const policyKeyHash = policyKeyHashOutput.trim();
    const tipResponse = await executeCommand(`${cmd} query tip --testnet-magic 1`);
    const { slot: currentSlot } = JSON.parse(tipResponse);
    const slotsBeforeExpiry = 696600;
    expiresAtSlot = currentSlot + slotsBeforeExpiry;
    
    const policyScriptContent = `{
      "type": "all",
      "scripts": [
        {
          "type": "before",
          "slot": ${expiresAtSlot}
        },
        {
          "type": "sig",
          "keyHash": "${policyKeyHash}"
        }
      ]
    }`;
    fs.writeFileSync('nft-policy.script', policyScriptContent, 'utf8');
 
    const policyIdOutput = await executeCommand(`${cmd} transaction policyid --script-file nft-policy.script`);
    const policyId = policyIdOutput.trim();

    return {
        verificationKey: fs.readFileSync(verificationKeyFile, 'utf8'),
        signingKey: fs.readFileSync(signingKeyFile, 'utf8'),
        policyKeyHash,
        expiresAtSlot,
        policyScriptContent,
        policyId,
    };
}


async function signTransaction() {

  const addressFilePathkey = './addressdetails/payment.skey';
  const sourceAddressskey = fs.readFileSync(addressFilePathkey, 'utf8').trim();
  const free_draft = 'mint.txraw'
  const free_draft_read = fs.readFileSync(free_draft, 'utf8').trim();
  console.log(sourceAddressskey)
  console.log(free_draft_read)

  const cmdSignTransaction = `
      ${cmd} transaction sign \
      --signing-key-file nft-policy.skey \
      --signing-key-file ${addressFilePathkey} \
      --testnet-magic 1 \
      --tx-body-file ${free_draft} \
      --out-file mint.txsigned
  `;

  return await executeCommand(cmdSignTransaction);
}

async function submitTransaction() {
  const minttxsigned = 'mint.txsigned';
  console.log(minttxsigned)
  const cmdSubmitTransaction = `
      ${cmd} transaction submit \
      --tx-file ${minttxsigned} \
      --testnet-magic 1
  `;

  return await executeCommand(cmdSubmitTransaction);
}





// ============================================ 5. Endpoints ============================================

server.get("/test", async (req, res) => {
  res.json("walletData");
});

server.get('/query-tip', (req, res) => {
  let output = '';
  let error = '';

  try {
 

    const args = ['query', 'tip', '--testnet-magic', '1'];
  
    const child = spawn(cmd, args);
  
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
  
    child.stderr.on('data', (data) => {
      error += data.toString();
    });
  
    child.on('error', (err) => {
      console.error(`error: ${err.message}`);
      error += err.message;
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);

      if (error) {
        res.status(500).json({ error });
      } else {
        res.json({ output });
      }
    });

  } catch (error) {
    console.log(`Testing ${error}`);
    res.status(500).json({ error: error.message });
  }
});


server.post('/upload', async (req, res) => {
  try {


   // Access the book query parameter from the request
   let bookcha = req.body.book;
   console.log("--------Book Id-------");
   console.log(bookcha)

   // Mapping of book values to image filenames
   const bookImageMapping = {
    "64dc5c92680b46678c261485": "miche.png",
    "64dc5ccd680b46678c261487": "nelson.png",
    "64dc5cd9680b46678c261489": "borncrime.png",
    "64dec37ec7cef1be3d92cef4": "hobbit.png",
    "64dec462c7cef1be3d92cef6": "grass.png",
    "64dec476c7cef1be3d92cef8": "diabites.png",
    "64dec48cc7cef1be3d92cefa": "sapiens.png",
    "64dec49fc7cef1be3d92cefc": "predu.png",
    "64dec4b0c7cef1be3d92cefe": "gatsby.png"
};


   // Check if the book value is in the mapping
   let imagePath = bookImageMapping[bookcha];
   if (!imagePath) {
     imagePath =  'bookimage.jpg'; // Adjust the path if the image is in a different directory
   }

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);

   console.log("---------------");
   console.log(__dirname);

    const bookimage = join(__dirname, imagePath); // Adjust the path if the image is in a different directory
    console.log("--------Book Image-------");
    console.log(bookimage)
    const pindataupload =  await uploadFileToPindata(bookimage, 'books', {
      customKey: 'customValue',
      customKey2: 'customValue2'
  });
    
    console.log(pindataupload.IpfsHash)
    imageId = pindataupload.IpfsHash;
    console.log(imageId)
    console.log(pindataupload.IpfsHash)
    res.json({ pindataupload });
//     res.json({ imagePath });


    // res.sendFile(imagePath);
  } catch (error) {
      console.error('Error sending file:', error.message);
      res.status(500).json({ error: 'Failed to send the file' });
  }
});


// server.post('/upload', upload.single('file'), (req, res) => {
//   try {
//     console.log(__dirname)
//       const imagePath = path.join(__dirname, 'uploads', req.file.filename);
//       console.log("Uploaded file path:", imagePath);

//       res.json({ imagePath: imagePath });
//   } catch (error) {
//       console.error('Error uploading file:', error.message);
//       res.status(500).json({ error: 'Failed to upload the file' });
//   }
// });


// server.get('/upload',  async (req, res) => {
//   try {
//     // const imageFile = req.file;
//     // imageId = await uploadFunction(imageFile);
//     // const imageId = await uploadFileToIPFS();
//     // const imagePath = path.join(__dirname, 'src', 'yourImageFileName.ext'); // replace 'yourImageFileName.ext' with your actual file name
    


//     const imagePath = path.join(__dirname, 'bookimage.jpg');
//     console.log(imagePath)

//   //   console.log(imageFile);
//   //   const pindataupload =  await uploadFileToPindata(imagePath, 'MyCustomName', {
//   //     customKey: 'customValue',
//   //     customKey2: 'customValue2'
//   // });
    
//   //   console.log(pindataupload.IpfsHash)
//   //   imageId = pindataupload.IpfsHash;
//     // res.json({ pindataupload });
//     res.json({ imagePath });
//   } catch (error) {
//     // console.error('Error uploading file to IPFS:', error.message);
//     // res.status(500).json({ error: 'Failed to upload file to IPFS' });
//     console.error('Error file:', error.message);
//     res.status(500).json({ error: 'Failed to print on console' });
//   }
// });

server.get('/generate-keys', async (req, res) => {
  try {
      cachedKeys = await generateKeys();
      res.json(cachedKeys);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

server.get('/retrieve-cached-keys', (req, res) => {
  if (!cachedKeys) {
      return res.status(404).json({ error: "Keys not generated or cached." });
  }
  res.json(cachedKeys);
});



server.get('/get-utxo', async (req, res) => {
  try {
      const addressFilePath = './addressdetails/payment.addr';
      const sourceAddress = fs.readFileSync(addressFilePath, 'utf8').trim();

      console.log(sourceAddress);

      if (!sourceAddress) {
          return res.status(400).json({ error: "sourceAddress is required" });
      }

      const cmdToExecute = `${cmd} query utxo --address ${sourceAddress} --testnet-magic 1`;
      const execPromisified = promisify(exec);
      const { stdout } = await execPromisified(cmdToExecute);

      const lines = stdout.split('\n').slice(2);  // ignoring header lines
     
      for (let line of lines) {
          const [utxoHash, utxoIndex, ...rest] = line.split(/\s+/);
          
          if (utxoIndex === '1') {
              // Extract only the lovelace value
              const valueRegex = /(\d+) lovelace/;
              const match = valueRegex.exec(rest.join(' '));
              
              if (match) {
                cachedUTXODetails = {
                      utxoHash,
                      utxoIndex,
                      utxoValue: match[1]
                  };
                  break; // exit loop once we've found the UTXO with TxIx of 1
              }
          }
      }

      if (!cachedUTXODetails) {
          return res.status(404).json({ error: "No UTXO found with TxIx of 1" });
      }

      res.json(cachedUTXODetails);

  } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching UTXO details.", details: error.message });
  }
});


// ... your previous imports and setup ...
//I have change the end point

// Endpoint to handle NFT creation
server.post('/create-nft', async (req, res) => {
  try {

    const assetName = req.body.assetName;
    const additionalId = req.body.additionalId;
    const httpUrl = req.body.httpUrl;
    const title = req.body.title;
    const description = req.body.description;
    const startPage = req.body.startPage;
    const endPage = req.body.endPage;
    const authorName = req.body.authorName;
    const orderRef = req.body.orderRefID;

    console.log({
      assetName,
      additionalId,
      httpUrl,
      title,
      description,
      startPage,
      endPage,
      authorName,
      orderRef
  });
    
    createasset_name = assetName
      // Extracting details from the request body
      // const { policyId, ipfsCID } = req.body;
     // Log the details for debugging
     console.log("-----------------------------------------------------------------------------------0");
     console.log(cachedKeys);
     console.log(cachedKeys.policyId);
     console.log(imageId);
      
       // If either policyId or ipfsCID is not provided, return an error
       if (!cachedKeys) {
        return res.status(404).json({ error: "Policy ID not generated or cached." });
    } else if (!cachedKeys.policyId || !imageId) {
        return res.status(400).json({ error: "Both policyId and ipfsCID are required" });
    }else{

      const policyId = cachedKeys.policyId;
      const ipfsCID = imageId;

      // Construct the NFT JSON structure
      const nftStructure = {
        "721": {
          [policyId]: {
            [assetName]: {
              "name": `${title} ${additionalId}`,
              "description": description,
              "mediaType": "image/png",
              "https": httpUrl,
              "image": `ipfs://${ipfsCID}`,
              "startPage": startPage,
              "endPage": endPage,
              "author": authorName,
              "orderRef": orderRef,
              "owner": "Rushi Chavan"
            }
          }
        }
      };
   // Save the nftStructure to nft-metadata.json
   fs.writeFileSync('nft-metadata.json', JSON.stringify(nftStructure, null, 2));

   // Execute the cardano-cli command
   await executeCommand(`${cmd} query protocol-parameters --testnet-magic 1 --out-file protocol.json`);

   // Optionally, read the contents of protocol.json if needed
   const protocolData = fs.readFileSync('nft-metadata.json', 'utf8');

      // In a real-world scenario, you'd probably want to store the nftStructure 
      // in a database or take further action at this point.
      // For this example, we're simply returning the created structure.
      res.json({
          nftStructure: nftStructure,
          protocolData: JSON.parse(protocolData)
      });
    }
    

  } catch (error) {
      res.status(500).json({ error: "An error occurred while creating the NFT.", details: error.message });
  }
});


server.post('/build-nft-draft-transaction', async (req, res) => {
  try {
     

    let minval = req.body.minvalue;
    let minfee = req.body.minfee;
    console.log(createasset_name)
    console.log(`UTXO Details:`, cachedUTXODetails);

    const UTXO0H = cachedUTXODetails.utxoHash;
    const UTXO0I = cachedUTXODetails.utxoIndex;
    const UTXO0V = cachedUTXODetails.utxoValue;

    let DESTADDR = req.body.destAddress.toString();

    console.log(`DESTADDR: ${DESTADDR}`);

    const POLICYID = cachedKeys.policyId;
    console.log(`POLICYID: ${POLICYID}`);

    const addressFilePath = './addressdetails/payment.addr';
    const PAYMENTADDR = fs.readFileSync(addressFilePath, 'utf8').trim();
    console.log(`PAYMENTADDR: ${PAYMENTADDR}`);

    const NFT_ASSETNAME = createasset_name;
    const NFT_ASSETHEX = await executeCommand(`echo -n ${NFT_ASSETNAME} | xxd -b -ps -c 80 | tr -d '\n'`);
    console.log(`NFT_ASSETHEX: ${NFT_ASSETHEX}`);

    const MIN_LOVELACE = minval;
    const TXOUT_CHANGE = UTXO0V - MIN_LOVELACE;
    console.log(`MIN_LOVELACE: ${MIN_LOVELACE}, TXOUT_CHANGE: ${TXOUT_CHANGE}`);

    // console.log("minval:", minval);
    // console.log("minfee:", minfee);
    // console.log("UTXO0H:", UTXO0H);
    // console.log("UTXO0I:", UTXO0I);
    // console.log("UTXO0V:", UTXO0V);
    // console.log("DESTADDR:", DESTADDR);
    // console.log("POLICYID:", POLICYID);
    // // console.log("buildFEE:", buildFEE);
    // // console.log("FEE:", FEE);
    // console.log("addressFilePath:", addressFilePath);
    // console.log("PAYMENTADDR:", PAYMENTADDR);
    // console.log("NFT_ASSETNAME:", NFT_ASSETNAME);
    // console.log("NFT_ASSETHEX:", NFT_ASSETHEX);
    // console.log("MIN_LOVELACE:", MIN_LOVELACE);
    // console.log("TXOUT_CHANGE:", TXOUT_CHANGE);


      // Build raw transaction
      const cmdBuildRaw = `
          ${cmd} transaction build-raw \
          --tx-in ${UTXO0H}#${UTXO0I} \
          --tx-out ${DESTADDR}+${MIN_LOVELACE}+"1 ${POLICYID}.${NFT_ASSETHEX}" \
          --tx-out ${PAYMENTADDR}+${TXOUT_CHANGE} \
          --metadata-json-file nft-metadata.json \
          --mint "1 ${POLICYID}.${NFT_ASSETHEX}" \
          --minting-script-file nft-policy.script \
          --invalid-hereafter ${expiresAtSlot} \
          --fee ${minfee} \
          --out-file fee_draft.txraw
      `;
      await executeCommand(cmdBuildRaw);

      // Calculate the fee
      const cmdCalculateFee = `${cmd} transaction calculate-min-fee --tx-body-file fee_draft.txraw --tx-in-count 1 --tx-out-count 2 --witness-count 2 --testnet-magic 1 --protocol-params-file protocol.json`;
      const FEE = (await executeCommand(cmdCalculateFee)).match(/[0-9]+/)[0];
      buildFEE = FEE;

      res.json({ FEE });

  } catch (error) {
      res.status(500).json({ error: "An error occurred while building the NFT transaction.", details: error.message });
  }
});





















server.post('/build-raw-tx', async (req, res) => {
  try {


      console.log(createasset_name)
      let minval = req.body.minvalue;
      let minfee = req.body.minfee;
      const UTXO0H = cachedUTXODetails.utxoHash;
      const UTXO0I = cachedUTXODetails.utxoIndex;
      const UTXO0V = cachedUTXODetails.utxoValue;
      const DESTADDR = req.body.destAddress; // Make sure you send 'destAddr' in the request body
      const POLICYID = cachedKeys.policyId;
      console.log(buildFEE)
      const FEE = buildFEE; // Make sure you send 'FEE' in the request body

      const addressFilePath = './addressdetails/payment.addr';
      const PAYMENTADDR = fs.readFileSync(addressFilePath, 'utf8').trim();
      const NFT_ASSETNAME = createasset_name;
      const NFT_ASSETHEX = await executeCommand(`echo -n ${NFT_ASSETNAME} | xxd -b -ps -c 80 | tr -d '\n'`);

      const MIN_LOVELACE = minval;
      const TXOUT_CHANGE = UTXO0V - minfee - MIN_LOVELACE;


      
    console.log("minval:", minval);
    console.log("minfee:", minfee);
    console.log("UTXO0H:", UTXO0H);
    console.log("UTXO0I:", UTXO0I);
    console.log("UTXO0V:", UTXO0V);
    console.log("DESTADDR:", DESTADDR);
    console.log("POLICYID:", POLICYID);
    // console.log("buildFEE:", buildFEE);
    // console.log("FEE:", FEE);
    console.log("addressFilePath:", addressFilePath);
    console.log("PAYMENTADDR:", PAYMENTADDR);
    console.log("NFT_ASSETNAME:", NFT_ASSETNAME);
    console.log("NFT_ASSETHEX:", NFT_ASSETHEX);
    console.log("MIN_LOVELACE:", MIN_LOVELACE);
    console.log("TXOUT_CHANGE:", TXOUT_CHANGE);

      const cmdBuildRawTx = `
          ${cmd} transaction build-raw \
          --tx-in ${UTXO0H}#${UTXO0I} \
          --tx-out ${DESTADDR}+${MIN_LOVELACE}+"1 ${POLICYID}.${NFT_ASSETHEX}" \
          --tx-out ${PAYMENTADDR}+${TXOUT_CHANGE} \
          --metadata-json-file nft-metadata.json \
          --mint "1 ${POLICYID}.${NFT_ASSETHEX}" \
          --minting-script-file nft-policy.script \
          --invalid-hereafter ${expiresAtSlot} \
          --fee ${minfee} \
          --out-file mint.txraw
      `;
      await executeCommand(cmdBuildRawTx);



      await signTransaction();
      await submitTransaction();

      res.status(200).json({ success: true, message: 'Raw transaction built and submitted successfully.' });


  } catch (error) {
      res.status(500).json({ error: "An error occurred while building the raw transaction.", details: error.message });
  }
});


async function getTransactionId() {
  const cmdGetTxId = `${cmd} transaction txid --tx-file mint.txsigned`;
  return await executeCommand(cmdGetTxId);
}

server.get('/get-txid', async (req, res) => {
  try {
      const txId = await getTransactionId();
      res.status(200).json({ txId: txId.trim() });
  } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching the transaction ID.", details: error.message });
  }
});




server.post('/complete-nft-process', async (req, res) => {
  try {
      // 1. Generate and cache keys
      cachedKeys = await generateKeys();

     
      // 3. Get UTXO
      const addressFilePath = './addressdetails/payment.addr';
      const PAYMENTADDR = fs.readFileSync(addressFilePath, 'utf8').trim();
      console.log(PAYMENTADDR);
      if (!PAYMENTADDR) {
          return res.status(400).json({ error: "sourceAddress is required" });
      }
      const cmdToExecute = `${cmd} query utxo --address ${PAYMENTADDR} --testnet-magic 1`;
  
      const execPromisified = promisify(exec);
      const { stdout } = await execPromisified(cmdToExecute);

      const lines = stdout.split('\n').slice(2);  // ignoring header lines
     
      for (let line of lines) {
          const [utxoHash, utxoIndex, ...rest] = line.split(/\s+/);
          
          if (utxoIndex === '1') {
              // Extract only the lovelace value
              const valueRegex = /(\d+) lovelace/;
              const match = valueRegex.exec(rest.join(' '));
              
              if (match) {
                cachedUTXODetails = {
                      utxoHash,
                      utxoIndex,
                      utxoValue: match[1]
                  };
                  break; // exit loop once we've found the UTXO with TxIx of 1
              }
          }
      }

      if (!cachedUTXODetails) {
          return res.status(404).json({ error: "No UTXO found with TxIx of 1" });
      }

    

      // 4. Create the NFT
      const assetname = req.body.assetname;
      const addId = req.body.addId;
      const num = req.body.num;
      createasset_name = assetname;
     

     // Log the details for debugging
     console.log("-----------------------------------------------------------------------------------0");
     console.log(cachedKeys);
     console.log(cachedKeys.policyId);
    //  console.log(imageId);
      
       // If either policyId or ipfsCID is not provided, return an error
       if (!cachedKeys) {
        return res.status(404).json({ error: "Policy ID not generated or cached." });
    } else if (!cachedKeys.policyId ) {
        return res.status(400).json({ error: "Both policyId are required" });
    }else{

      const policyId = cachedKeys.policyId;
      // const ipfsCID = imageId;
      const ipfsCID = req.body.ipfsCID;

      // Construct the NFT JSON structure
      const nftStructure = {
          "721": {
              [policyId]: {
                  [assetname]: {
                      "name": `The Lovelace Academy Logo ${addId}`,
                      "description": "Our Logo for the Lovelace Academy NFT Minting Guide",
                      "mediaType": "image/png",
                      "https": `https://learn.lovelace.academy/tokens/nft-minting-guide/${num}`,
                      "image": `ipfs://${ipfsCID}`,
                      "startpage": 0,
                      "endpage": 43,
                      "title": "Lord of the rings",
                      "Owner": "Rushi Chavan"
                  }
              }
          }
      };
   // Save the nftStructure to nft-metadata.json
          fs.writeFileSync('nft-metadata.json', JSON.stringify(nftStructure, null, 2));

          // Execute the cardano-cli command
          await executeCommand(`${cmd} query protocol-parameters --testnet-magic 1 --out-file protocol.json`);

          // Optionally, read the contents of protocol.json if needed
          const protocolData = fs.readFileSync('nft-metadata.json', 'utf8');

         
        }

      // ... rest of the NFT creation logic ...

      // 5. Build NFT draft transaction
      let minval = req.body.minvalue;
      let minfee = req.body.minfee;
    
      console.log(createasset_name)
      console.log(`UTXO Details:`, cachedUTXODetails);
  
      const UTXO0H = cachedUTXODetails.utxoHash;
      const UTXO0I = cachedUTXODetails.utxoIndex;
      const UTXO0V = cachedUTXODetails.utxoValue;
  
      let DESTADDR = req.body.destAddress.toString();
  
      console.log(`DESTADDR: ${DESTADDR}`);
  
      const POLICYID = cachedKeys.policyId;
      console.log(`POLICYID: ${POLICYID}`);
  
    
  
      const NFT_ASSETNAME = createasset_name;
      const NFT_ASSETHEX = await executeCommand(`echo -n ${NFT_ASSETNAME} | xxd -b -ps -c 80 | tr -d '\n'`);
      console.log(`NFT_ASSETHEX: ${NFT_ASSETHEX}`);
  
      const MIN_LOVELACE = minval;
      const TXOUT_CHANGE = UTXO0V - MIN_LOVELACE;
      console.log(`MIN_LOVELACE: ${MIN_LOVELACE}, TXOUT_CHANGE: ${TXOUT_CHANGE}`);
  
        // Build raw transaction
        const cmdBuildRaw = `
            ${cmd} transaction build-raw \
            --tx-in ${UTXO0H}#${UTXO0I} \
            --tx-out ${DESTADDR}+${MIN_LOVELACE}+"1 ${POLICYID}.${NFT_ASSETHEX}" \
            --tx-out ${PAYMENTADDR}+${TXOUT_CHANGE} \
            --metadata-json-file nft-metadata.json \
            --mint "1 ${POLICYID}.${NFT_ASSETHEX}" \
            --minting-script-file nft-policy.script \
            --invalid-hereafter ${expiresAtSlot} \
            --fee ${minfee} \
            --out-file fee_draft.txraw
        `;
        await executeCommand(cmdBuildRaw);
  
        // Calculate the fee
        const cmdCalculateFee = `${cmd} transaction calculate-min-fee --tx-body-file fee_draft.txraw --tx-in-count 1 --tx-out-count 2 --witness-count 2 --testnet-magic 1 --protocol-params-file protocol.json`;
        const FEE = (await executeCommand(cmdCalculateFee)).match(/[0-9]+/)[0];
        buildFEE = FEE;
  
      // ... rest of the build draft transaction logic ...
      
      console.log(createasset_name)
   
     
     
      console.log(buildFEE)
     // Make sure you send 'FEE' in the request body

     
      let minval_real = req.body.minvalue_real;
      let minfee_real = req.body.minfee_real;
      const MIN_LOVELACE_REAL = minval_real;
      const TXOUT_CHANGE_REAL = UTXO0V - minfee_real - MIN_LOVELACE_REAL;

      const cmdBuildRawTx = `
          ${cmd} transaction build-raw \
          --tx-in ${UTXO0H}#${UTXO0I} \
          --tx-out ${DESTADDR}+${MIN_LOVELACE}+"1 ${POLICYID}.${NFT_ASSETHEX}" \
          --tx-out ${PAYMENTADDR}+${TXOUT_CHANGE_REAL} \
          --metadata-json-file nft-metadata.json \
          --mint "1 ${POLICYID}.${NFT_ASSETHEX}" \
          --minting-script-file nft-policy.script \
          --invalid-hereafter ${expiresAtSlot} \
          --fee ${minfee_real} \
          --out-file mint.txraw
      `;
      await executeCommand(cmdBuildRawTx);



      // 6. Build and submit raw transaction

      await signTransaction();
      await submitTransaction();

      res.json({
          generatedKeys: cachedKeys,
          cachedKeys: cachedKeys,
          utxoDetails: cachedUTXODetails,
          nftStructure: nftStructure,
          protocolData: JSON.parse(protocolData),
          fee: buildFEE,
          success: true,
          message: 'All steps completed successfully.'
      });

  } catch (error) {
      res.status(500).json({ error: "An error occurred during the complete process.", details: error.message });
  }
});




// ... your server listening code ...



// ============================================ 6. Payment Confirmation ============================================
// /:txHash
server.post('/verify', (req, res) => {



  let error = '';

  console.log(req.body.txHash);  // This will display the data type of lovelaceToSend
  console.log(req.body.lovelaceToSend); 
  let txHash = req.body.txHash;
  let lovelaceToSend = req.body.lovelaceToSend;
  console.log(typeof txHash);          // This will display the data type of txHash
  console.log(typeof lovelaceToSend);  // This will display the data type of lovelaceToSend
  console.log(txHash)
  console.log(lovelaceToSend)
  
 
  let EXPECTED_PAYMENT = lovelaceToSend
  let expectedTxHash = txHash.toString();
  const paymentAddrFile = '$HOME/geek-text-frontend-main/addressdetails/payment.addr';

  // Get address content from the file
  const catCommand = `$(cat ${paymentAddrFile})`;

  // Construct the command with its arguments
  const fullCommand = [
      cmd,
      'query',
      'utxo',
      '--testnet-magic',
      '1',
      '--address',
      catCommand
  ].join(" ");

  exec(fullCommand, (error, stdout, stderr) => {

    try {
      
    
      if (error) {
          console.error(`exec error: ${error.message}`);
          return res.status(500).json({ error: error.message });
      }

      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return res.status(500).json({ error: stderr });
      }

      const rawUtxoTable = stdout;
      const utxoTableRows = rawUtxoTable.trim().split('\n');
      let isPaymentVerified = false;

      for (let x = 2; x < utxoTableRows.length; x++) {
          const cells = utxoTableRows[x].split(" ").filter(i => i);
          const currentTxHash = cells[0];
          const amount = parseInt(cells[2]);
          console.log(`Amount - ${amount}`)
          if (currentTxHash === expectedTxHash && amount === EXPECTED_PAYMENT) {
              isPaymentVerified = true;
              break;  // No need to check other UTXOs once the transaction is verified
          }
      }
    
      console.log(`Expected Payment: ${EXPECTED_PAYMENT} LOVELACE`);
      console.log(`Payment Verified: ${(isPaymentVerified ? "✅" : "❌")}`);

      return res.status(200).json({
        isPaymentVerified: isPaymentVerified
    });

  }  catch (error) {
      console.error(`Error verifying payment: ${error.message}`);
      return res.status(500).json({
          error: `Error verifying payment: ${error.message}`
      });
    }
   


  });


});




// ============================================ 7. Database Configuration ============================================
const mongoURI = process.env.mongoURI;
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
};

mongoose.connect(mongoURI, connectionOptions, (error) => {
    if (error) {
        return console.log(error);
    }
    console.log(`Connection to MongoDB was successful`);
});

// ============================================ 7. Route Handlers ============================================
server.use(AuthRoute);
server.use('/books', booksRouter);
server.use('/genres', genresRouter);
server.use('/authors', authorsRouter);
server.use(AccountManager);
server.use(LoggingCredentials);
server.use('/orders', orderRoute);




// ============================================ 8. Server Connection ============================================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
// 5e5ec9bab35d3c27075b7bd863b0410cf7811d13031ca717a250331c720dd25a


// server.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const imageFile = req.file;
//     // imageId = await uploadFunction(imageFile);
//     // const imageId = await uploadFileToIPFS();
//     // const imagePath = path.join(__dirname, 'src', 'yourImageFileName.ext'); // replace 'yourImageFileName.ext' with your actual file name
    
//     console.log(imageFile);
//     const pindataupload =  await uploadFileToPindata(imageFile.path, 'MyCustomName', {
//       customKey: 'customValue',
//       customKey2: 'customValue2'
//   });
    
//     console.log(pindataupload.IpfsHash)
//     imageId = pindataupload.IpfsHash;
//     res.json({ pindataupload });
//   } catch (error) {
//     console.error('Error uploading file to IPFS:', error.message);
//     res.status(500).json({ error: 'Failed to upload file to IPFS' });
//   }
// });

// ============================================ 1. Import Statements ============================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import multer from "multer";
import bodyParser from "body-parser";
import Web3 from "web3";
import { spawn, exec } from "child_process";
import { promisify } from "util";


import AuthRoute from './routes/users.js';
import booksRouter from './routes/books.js';
import genresRouter from './routes/genres.js';
import authorsRouter from './routes/authors.js';
import AccountManager from './routes/AccountManager/AccountManger.js';
import LoggingCredentials from './routes/LoggingCredentials/LoggingCredentialsManager.js';
import pinataSDK from '@pinata/sdk';

// ============================================ 2. Initialization ============================================
dotenv.config();
const server = express();

const web3 = new Web3('http://127.0.0.1:8545/');
const baseUrlIPFS = `https://milkomeda-testnet.blockfrost.io/api/v0/`;
const projectId = 'ipfsTyBkmywh3GqzDjcvobV6XRf2g6Lz4mfj';
const filePath = './new_2.png';

// Use the api keys by specifying your api key and api secret

const pinata = new pinataSDK({ pinataApiKey: '2f26bd17944b0a4ef84f', pinataSecretApiKey: '7c08ad246767ac879e8adbec2ed086f32dcf4eb5b33c24b4afd6e092f312a866' });
const res = await pinata.testAuthentication()
console.log(`"Congratulations! You are communicating with the Pinata API"! ${res}`)

// ============================================ 3. Middlewares ============================================
server.use(cors());
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });


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
    const slotsBeforeExpiry = 66600;
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
  const free_draft = 'fee_draft.txraw'
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


server.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const imageFile = req.file;
    // imageId = await uploadFunction(imageFile);
    // const imageId = await uploadFileToIPFS();
    console.log(imageFile);
    const pindataupload =  await uploadFileToPindata(imageFile.path, 'MyCustomName', {
      customKey: 'customValue',
      customKey2: 'customValue2'
  });
    
    console.log(pindataupload.IpfsHash)
    imageId = pindataupload.IpfsHash;
    res.json({ pindataupload });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error.message);
    res.status(500).json({ error: 'Failed to upload file to IPFS' });
  }
});

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



// Endpoint for fetching UTXO details
server.get('/get-utxo', async (req, res) => {
  try {
      // const { sourceAddress } = req.body;

         // Read the source address from the file
      const addressFilePath = './addressdetails/payment.addr';
      const sourceAddress = fs.readFileSync(addressFilePath, 'utf8').trim();

      console.log(sourceAddress)
 

      // If sourceAddress is not provided or is invalid, return an error.
      if (!sourceAddress) {
          return res.status(400).json({ error: "sourceAddress is required" });
      }

      // Execute the cardano-cli command to get UTXO details.
      const cmdToExecute = `${cmd} query utxo --address ${sourceAddress} --testnet-magic 1`;
      const execPromisified = promisify(exec);
      const { stdout } = await execPromisified(cmdToExecute);
      
      // Extract relevant details from the output
      const lines = stdout.split('\n');
      const utxoLine = lines[2];  // assuming the UTXO details are on the third line.
      
      const [utxoHash, utxoIndex, utxoValue] = utxoLine.split(/\s+/);


       // Save the UTXO details to memory (cache)
    cachedUTXODetails = {
      utxoHash,
      utxoIndex,
      utxoValue
  };


      // Return the results
      res.json(cachedUTXODetails);

  } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching UTXO details.", details: error.message });
  }
});

// ... your previous imports and setup ...

// Endpoint to handle NFT creation
server.get('/create-nft', async (req, res) => {
  try {

    const assetname = req.body.assetname;
    const addId = req.body.addId;
    const num = req.body.num;
    createasset_name = assetname
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

    const MIN_LOVELACE = 1;
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
          --fee 0 \
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

      const MIN_LOVELACE = 2500000;
      const TXOUT_CHANGE = UTXO0V - FEE - MIN_LOVELACE;

      const cmdBuildRawTx = `
          ${cmd} transaction build-raw \
          --tx-in ${UTXO0H}#${UTXO0I} \
          --tx-out ${DESTADDR}+${MIN_LOVELACE}+"1 ${POLICYID}.${NFT_ASSETHEX}" \
          --tx-out ${PAYMENTADDR}+${TXOUT_CHANGE} \
          --metadata-json-file nft-metadata.json \
          --mint "1 ${POLICYID}.${NFT_ASSETHEX}" \
          --minting-script-file nft-policy.script \
          --invalid-hereafter ${expiresAtSlot} \
          --fee ${FEE} \
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

// ============================================ 8. Server Connection ============================================
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
// 5e5ec9bab35d3c27075b7bd863b0410cf7811d13031ca717a250331c720dd25a
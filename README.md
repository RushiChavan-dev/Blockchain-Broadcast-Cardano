#  Blockchain Broadcast - Cardano Blockchain

## GitHub Documentation: Configuration for `blockchain-broadcast-backend` and `blockchain-broadcast-frontend`

### Pre-requisites

Before you begin the configurations for `blockchain-broadcast-backend` and `blockchain-broadcast-frontend`, ensure you have the following set up:

1. **Cardano Node Installation**: Follow the step-by-step guide to install the test net Cardano blockchain using the following link: 
   - [Cardano Testnet Installation](https://github.com/RushiChavan-dev/cardano_installation)
   
   After installing, ensure that the Cardano node is running.

2. **Test Wallet**: The setup already includes a test wallet named `payment.addr`. Hence, there's no need to create a new test wallet. However, always be cautious and avoid performing any transactions involving real funds with test wallets.


### Configuration for `blockchain-broadcast-frontend`

#### 1. Setting up `config.js`

In the `config.js` file, provide your Blockfrost API Key for the blockchain backend.

```javascript
const blockfrostApiKey = {
    0: "ADD YOUR PROJECT ID", // Add your blockfrostApiKey from blockfrost
    1: "ADD YOUR PROJECT ID"  // You can add multiple keys if required
};
```

**Steps**:

- Navigate to your Blockfrost account.
- Search for your project API key.
- Replace `"ADD YOUR PROJECT ID"` with your actual Blockfrost project ID.

**Note**: Ensure you never expose your API keys publicly. Always utilize environment variables or secret management tools for sensitive data.


### Configuration for `blockchain-broadcast-backend`

#### 1. Setting up `server.js`

For the frontend's `server.js`, configure the details for IPFS:

```javascript
const baseUrlIPFS = `https://milkomeda-testnet.blockfrost.io/api/v0/`;
const projectId = 'ADD YOUR PROJECT ID HERE'; // Replace with your project ID
const filePath = './path_to_your_video.mp4'; // Path to the video you wish to upload to IPFS
```

#### 2. Authenticating with Pinata API

To set up and authenticate with the Pinata API for the blockchain frontend, follow the below code:

```javascript
const pinata = new pinataSDK({ 
    pinataApiKey: 'YOUR_PINATA_API_KEY', 
    pinataSecretApiKey: 'YOUR_PINATA_SECRET_API_KEY' 
});

const res = await pinata.testAuthentication();
console.log(`"Congratulations! You are communicating with the Pinata API"! ${res}`);
```

**Steps**:

- Go to your Pinata account.
- Retrieve both your Pinata API Key and Secret API Key.
- Replace `'YOUR_PINATA_API_KEY'` with your actual Pinata API Key.
- Replace `'YOUR_PINATA_SECRET_API_KEY'` with your actual Secret API Key.

**Security Warning**: It's important to remember that the provided examples seem to have hardcoded API keys, which are not advised for production or public repositories. Always substitute sensitive data with placeholders in public documentation, and utilize environment variables or other secure techniques to store such keys in your actual codebase.

### Conclusion

After replacing placeholders with your real keys and IDs, you're set to use the configurations for both the backend and frontend of your blockchain broadcast application. Always ensure you securely store confidential information and avoid public exposure.

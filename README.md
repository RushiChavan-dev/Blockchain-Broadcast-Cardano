# Blockchain Broadcast Cardano
 
## GitHub Documentation: Configuration for `blockchain-broadcast-backend` and `blockchain-broadcast-frontend`

### Configuration for `blockchain-broadcast-backend`

#### 1. Setting up `config.js`

In the `config.js` file, you need to provide your Blockfrost API Key for the blockchain backend. 

```javascript
const blockfrostApiKey = {
    0: "ADD YOUR PROJECT ID", // Add your blockfrostApiKey from blockfrost
    1: "ADD YOUR PROJECT ID"  // You can add multiple keys if required
}
```

**Steps**:

- Navigate to your Blockfrost account.
- Look for your project API key.
- Replace `"ADD YOUR PROJECT ID"` with your actual Blockfrost project ID.

**Note**: Ensure to never expose your API keys publicly. Always use environment variables or secret management tools for sensitive information.

### Configuration for `blockchain-broadcast-frontend`

#### 1. Setting up `server.js`

In the `server.js` file, provide the configurations for IPFS:

```javascript
const baseUrlIPFS = `https://milkomeda-testnet.blockfrost.io/api/v0/`;
const projectId = 'ADD YOUR PROJECT ID HERE'; // Replace this with your project ID
const filePath = './new_2.png'; // Path to the file you want to upload to IPFS
```

#### 2. Authenticating with Pinata API

For the blockchain frontend, you'll also need to setup and authenticate with the Pinata API.

```javascript
const pinata = new pinataSDK({ 
    pinataApiKey: 'YOUR_PINATA_API_KEY', 
    pinataSecretApiKey: 'YOUR_PINATA_SECRET_API_KEY' 
});

const res = await pinata.testAuthentication();
console.log(`"Congratulations! You are communicating with the Pinata API"! ${res}`);
```

**Steps**:

- Navigate to your Pinata account.
- Retrieve both your Pinata API Key and Secret API Key.
- Replace `'YOUR_PINATA_API_KEY'` with your actual Pinata API Key.
- Replace `'YOUR_PINATA_SECRET_API_KEY'` with your actual Secret API Key.

**Security Warning**: The example provided seems to have hardcoded API keys, which is not recommended for production or public repositories. Always replace sensitive data with placeholders in public documentation and use environment variables or other secure methods to store such keys in your actual codebase.

### Conclusion

Once you have replaced placeholders with your actual keys and IDs, you are ready to use the configurations for both the backend and frontend of your blockchain broadcast application. Make sure to always store sensitive information securely and never expose them publicly.

// External libraries and CSS imports
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { Lucid } from "lucid-cardano";

// Your custom component and state management imports
import App from './App';
import store from './Redux/store';
import { LucidProvider } from './helper/LucidProvider'; // Adjusted path, removing "../src" since you're likely in the "src" folder already.


const lucidInstance = await Lucid.new();

// Embedding the app into the browser
ReactDOM.render(
  // Providing the Lucid context to all child components
  <LucidProvider value={lucidInstance}>
    {/* Making the Redux store available to all child components */}
    <Provider store={store}>
      <App />
    </Provider>
  </LucidProvider>,
  document.getElementById('root')
);

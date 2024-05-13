import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use Routes and Route from react-router-dom
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ViewGig from './pages/ViewGig';
import SubmitWork from './pages/SubmitWork';
import MyGigs from './pages/MyGigs';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const LiskSepolia = {
  id: 4202,
  name: "LiskSepolia",
  iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/1214.png",
  iconBackground: "#fff",
  nativeCurrency: { name: "LiskSepolia", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia-api.lisk.com/"] },
  },
  blockExplorers: {
    default: { name: "LiskSepolia", url: "https://sepolia-blockscout.lisk.com//" },
  },
};

const config = getDefaultConfig({
  appName: "BitGigs",
  projectId: "b85ade4fb7f47c87f0e8a969594cfda0",
  chains: [LiskSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes> {/* Wrap your routes with <Routes> */}
                <Route path="/" element={<Home />} /> {/* Use 'element' prop instead of 'component' */}
                <Route path="/view/:id" element={<ViewGig />} />
                <Route path='/submit/:id' element={<SubmitWork />} />
                <Route path='mygigs' element={<MyGigs />} />
              </Routes>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;

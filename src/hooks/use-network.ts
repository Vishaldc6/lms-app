import * as Network from "expo-network";
import { useEffect, useState } from "react";

export function useNetwork() {
  const [isOffline, setIsOffline] = useState(false);

  const checkNetwork = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    } catch (error) {
      setIsOffline(false);
    }
  };

  useEffect(() => {
    checkNetwork();
    const interval = setInterval(checkNetwork, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { isOffline, checkNetwork };
}

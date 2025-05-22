import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppRoutes from "./route"; // Import routing dari file terpisah
import { refresh } from "./redux/authSlice";

function App() {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Set up token refresh interval
  useEffect(() => {
    let refreshInterval;

    if (isAuthenticated && token) {
      // Refresh token every 55 minutes (assuming 1 hour expiry)
      refreshInterval = setInterval(() => {
        dispatch(refresh());
      }, 55 * 60 * 1000);
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [isAuthenticated, token, dispatch]);

  return <AppRoutes isLoggedIn={isAuthenticated} />;
}

export default App;

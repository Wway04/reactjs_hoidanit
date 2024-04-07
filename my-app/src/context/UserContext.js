import { createContext, useEffect, useState } from "react";

const UseContext = createContext();

function UserContext({ children }) {
  const [userContext, setUserContext] = useState({});

  const [tokenContext, setTokenContext] = useState();

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("email")) {
      setUserContext({ email: JSON.parse(localStorage.getItem("email")), auth: true });
      setTokenContext(JSON.parse(localStorage.getItem("token")));
    }
  }, []);

  const loginContext = (email, token) => {
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("email", JSON.stringify(email));
    setTokenContext(token);
    setUserContext(() => ({ email, auth: true }));
  };

  const logoutContext = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setTokenContext("");
    setUserContext(() => ({ email: "", auth: false }));
  };

  return (
    <UseContext.Provider value={{ userContext, tokenContext, loginContext, logoutContext }}>
      {children}
    </UseContext.Provider>
  );
}

export { UseContext, UserContext };

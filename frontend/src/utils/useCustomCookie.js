import { useCookies } from "react-cookie";

const useCustomCookie = () => {
  const [cookies] = useCookies(["token"]);

  return cookies.token || null;
};

export default useCustomCookie;

// checks for userfront authentication and redirects visitor if not authenticated
const checkAuth = (Userfront, navigate) => {
  try {
    if (!Userfront.accessToken()) {
      navigate("/");
    }
  } catch (error) {
    console.log(error);
  }
};

export default checkAuth;

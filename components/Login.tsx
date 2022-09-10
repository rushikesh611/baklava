import { useMetamask } from "@thirdweb-dev/react";

const Login = () => {
  const connectWithMetamask = useMetamask();

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <img
          className="rounded-full h-56 w-56 mb-10"
          src="https://i.imgur.com/S2yaOd5.jpg"
          alt=""
        />
        <h1 className="text-5xl text-white font-bold">Baklava</h1>
        <h2 className="text-white mt-2">
          Get started by logging in with your MetaMask
        </h2>
        <button
          onClick={connectWithMetamask}
          className="bg-white px-8 py-6 mt-10 rounded-lg shadow-lg font-bold"
        >
          Login with MetaMask
        </button>
      </div>
    </div>
  );
};

export default Login;

import PropagateLoader from "react-spinners/PropagateLoader";

const Loading = () => {
  return (
    <div className="bg-[#091B18] h-screen flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 mb-10">
        <img
          className="rounded-full h-20 w-20"
          src="https://i.imgur.com/S2yaOd5.jpg"
          alt=""
        />
        <h1 className="text-lg text-white font-bold">Loading Baklava</h1>
      </div>
      <PropagateLoader color="white" size={22} />
    </div>
  );
};

export default Loading;

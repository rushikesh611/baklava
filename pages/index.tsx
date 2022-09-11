import {
  useAddress,
  useContract,
  useContractCall,
  useContractData,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { ethers } from "ethers";
import { currency } from "../const";
import CountdownTimer from "../components/CountdownTimer";
import toast from "react-hot-toast";

const Home: NextPage = () => {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);
  const [quantity, setQuantity] = useState<number>(1);

  const { contract, isLoading } = useContract(
    process.env.LOTTERY_CONTRACT_ADDRESS
  );

  // console.log(contract);

  const { data: expiration } = useContractData(contract, "expiration");
  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  );
  const { data: currentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  );
  const { data: ticketPrice } = useContractData(contract, "ticketPrice");

  const { data: ticketCommission } = useContractData(
    contract,
    "ticketCommission"
  );

  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");
  const { data: tickets } = useContractData(contract, "getTickets");

  useEffect(() => {
    if (!tickets) return;
    const totalTickets: string[] = tickets;
    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTickets(noOfUserTickets);
  }, [tickets, address]);

  const handleClick = async () => {
    if (!ticketPrice) return;
    const notification = toast.loading("Buying tickets...");

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);
      toast.success("Tickets purchased successfully!", { id: notification });
      console.info("contract call success", data);
    } catch (error) {
      toast.error("Whoops something went wrong!", { id: notification });
    }
  };

  // if (isLoading) return <Loading />;

  if (!address) return <Login />;

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>Baklava</title>
      </Head>

      <div className="flex-1">
        <Header />
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5 ">
          <div className="stats-container">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>

            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl">
                  {currentWinningReward &&
                    ethers.utils.formatEther(currentWinningReward.toString())}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Tickets Remaining</h2>
                <p className="text-xl">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            <div className="mt-5 mb-3">
              <CountdownTimer />
            </div>
          </div>

          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2">
                <h2>Price per ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}
                  {currency}
                </p>
              </div>
              <div className="flex text-white items-center space-x-2 bg-[#091B18] border-[#004337] border p-4">
                <p>TICKETS</p>
                <input
                  className="flex w-full bg-transparent text-right outline-none"
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                        quantity}
                    {currency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(ticketCommission.toString())}
                    {currency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>+ Network Fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                onClick={handleClick}
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() === 0
                }
                className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md font-semibold text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:text-gray-100"
              >
                Buy {quantity} tickets for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                {currency}
              </button>
            </div>
            {userTickets > 0 && (
              <div className="stats">
                <p className="text-lg mb-2">
                  You have {userTickets} Tickets in this draw
                </p>
                <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p
                        key={index}
                        className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                      >
                        {index + 1}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="border-t border-emerald-500/20 flex items-center text-white p-5">
        <img
          className="h-10 w-10 filter hue-rotate-90 opacity-20 rounded-full"
          src="https://i.imgur.com/S2yaOd5.jpg"
          alt=""
        />
        <p className="text-xs text-emerald-900 pl-5">
          DISCLAIMER: This is a demo application and is not intended for use in
          a production environment. The code is open source and can be found{" "}
          <a href="https://github.com/rushikesh611/baklava">here</a>.
        </p>
      </footer>
    </div>
  );
};

export default Home;

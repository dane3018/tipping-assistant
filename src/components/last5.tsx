import { gameResult } from "@/utils/types";

interface last5Props {
  hteamWins: gameResult[];
  ateamWins: gameResult[];
  title: string;
}

export default function Last5(props: last5Props) {
  const resToColour = new Map([
    ["W", "bg-green-500"],
    ["L", "bg-red-500"],
    ["D", "bg-blue-500"],
  ]);

  return (
    <div className="shadow-2xs border-t-2 border-x-2 relative">
      <div className="flex justify-between items-center relative">
        {/* Centered Title */}
        <p className="absolute left-1/2 transform -translate-x-1/2">
          {props.title}
        </p>

        {/* Home team wins */}
        <div className="flex justify-center">
          {props.hteamWins.map((res, index) => (
            <div
              key={index}
              className={`w-4 h-4 p-4 m-4 flex items-center justify-center rounded-md ${resToColour.get(
                res,
              )}`}
            >
              <p className="font-bold text-xl text-gray-50">{res}</p>
            </div>
          ))}
        </div>

        {/* Away team wins */}
        <div className="flex justify-center">
          {props.ateamWins.map((res, index) => (
            <div
              key={index}
              className={`w-4 h-4 p-4 m-4 flex items-center justify-center rounded-md ${resToColour.get(
                res,
              )}`}
            >
              <p className="font-bold text-xl text-gray-50">{res}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { idToTeam, teamToImgPath } from "@/utils/constants";
import { last5h2h } from "@/utils/types";

interface h2hProps {
  hteamid: number;
  ateamid: number;
  h2h: last5h2h;
}

export default function HeadToHead(props: h2hProps) {
  const hteamImgPath = teamToImgPath(props.hteamid);
  const ateamImgPath = teamToImgPath(props.ateamid);
  return (
    <div className="shadow-2xs border-t-2 border-x-2 p-2">
      <h2 className="flex justify-center">Last 5 head to head matches </h2>
      <div className="flex justify-between pt-2">
        {props.h2h.map((homeRes, index) => (
          <div key={index} className="flex flex-col items-center px-2">
            {homeRes.result === "D" ? (
              <p className="text-lg font-semibold">D</p>
            ) : (
              <img
                src={homeRes.result === "W" ? hteamImgPath : ateamImgPath}
                alt={
                  homeRes.result === "W"
                    ? idToTeam[props.hteamid - 1]
                    : idToTeam[props.ateamid - 1]
                }
                className="w-18 h-18 object-contain"
              />
            )}
            <p>{homeRes.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

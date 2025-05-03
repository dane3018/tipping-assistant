interface h2hProps {
  hteamName: string;
  ateamName: string;
  h2h: boolean[];
}

export default function HeadToHead(props: h2hProps) {
  const hteamImgPath = `${props.hteamName.split(" ")[0]}.png`;
  const ateamImgPath = `${props.ateamName.split(" ")[0]}.png`;
  return (
    <div className="shadow-2xs border-t-2 border-x-2 p-2">
      <h2 className="flex justify-center">Last 5 head to head matches </h2>
      <div className="flex justify-between pt-2">
        {props.h2h.map((homeWin, index) => (
          <div key={index} className="felx flex-col items-center px-2">
            <img
              key={index}
              src={homeWin ? hteamImgPath : ateamImgPath}
              alt={homeWin ? props.hteamName : props.ateamName}
              className="w-18 h-18 object-contain"
            />
            <p>{index}th April</p>
          </div>
        ))}
      </div>
    </div>
  );
}

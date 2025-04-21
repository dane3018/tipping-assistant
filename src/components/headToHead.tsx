interface h2hProps {
  hteamImgPath: string;
  hteamName: string;
  ateamImgPath: string;
  ateamName: string;
  h2h: boolean[];
}

export default function HeadToHead(props: h2hProps) {
  return (
    <div className="shadow-2xs border-t-2 border-x-2">
      <h2 className="flex justify-center">Last 5 head to head matches </h2>
      <div className="flex justify-center">
        {props.h2h.map((homeWin, index) => (
          <img
            key={index}
            src={homeWin ? props.hteamImgPath : props.ateamImgPath}
            alt={homeWin ? props.hteamName : props.ateamName}
          />
        ))}
      </div>
    </div>
  );
}

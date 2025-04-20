interface last5Props {
  hteamWins: boolean[];
  ateamWins: boolean[];
  title: string;
}

export default function Last5(props: last5Props) {
  return (
    <div className="shadow-2xs border-t-2 border-x-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-center">
          {props.hteamWins.map((win, index) => (
            <div
              key={index}
              className={`w-4 h-4 p-4 m-4 flex items-center justify-center rounded-md ${
                win ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <p className="font-bold text-xl text-gray-50">
                {win ? "W" : "L"}
              </p>
            </div>
          ))}
        </div>
        <p className="">{props.title}</p>
        <div className="flex justify-center">
          {props.ateamWins.map((win, index) => (
            <div
              key={index}
              className={`w-4 h-4 p-4 m-4 flex items-center justify-center rounded-md ${
                win ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <p className="font-bold text-xl text-gray-50">
                {win ? "W" : "L"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

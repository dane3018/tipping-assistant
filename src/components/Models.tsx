import { Button } from "./ui/button";

interface model {
  modelName: string;
  winTeam: string;
  confidence: number;
  margin: number;
  err: number;
}

interface modelProps {
    models: model[]
}

export default function Models(props: modelProps) {
  return (
    <div className="shadow-2xs border-2 p-4">
      <h2 className="flex justify-center">Model Predictions</h2>

      <table className="table-auto border-collapse text-center w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Model</th>
            <th className="border px-4 py-2">Tip</th>
            <th className="border px-4 py-2">Confidence</th>
            <th className="border px-4 py-2">Margin</th>
            <th className="border px-4 py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {props.models.map((model, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border px-4 py-2">{model.modelName}</td>
              <td className="border px-4 py-2">{model.winTeam}</td>
              <td className="border px-4 py-2">{model.confidence}</td>
              <td className="border px-4 py-2">{model.margin}</td>
              <td className="border px-4 py-2">{model.err}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="w-full rounded-none"> Show More</Button>
    </div>
  );
}

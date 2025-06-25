import { SquiggleModel } from "@/utils/types";

export async function fetchModels(round: number): Promise<SquiggleModel[]> {
    const res = await fetch(
        `https://api.squiggle.com.au/?q=tips;year=2025;round=${round}`,
        {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ",
                // You can include other headers if needed
                // 'Authorization': `Bearer ${process.env.SOME_API_KEY}`,
            },
        },
    );
    const data = await res.json();
    return data.tips;
}

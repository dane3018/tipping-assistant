import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Welcome to your tipping assistant</h1>

      <Link
        href="/upcoming"
        className="mt-4 inline-block rounded-lg bg-primary text-primary-foreground px-6 py-3 text-lg font-medium shadow hover:bg-primary/90 transition"
      >
        Go to Upcoming Round
      </Link>
    </main>
  );
}

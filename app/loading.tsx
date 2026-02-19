export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <img
        src="/loader.gif"
        alt="Loading..."
        className="w-48 h-48" // adjust size as needed
      />
    </div>
  );
}

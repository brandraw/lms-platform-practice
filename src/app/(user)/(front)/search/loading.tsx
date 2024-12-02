export default function Loading() {
  return (
    <div className="new-container">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(10)].map((a) => (
          <div className="bg-neutral-200 rounded-lg animate-pulse aspect-video w-full"></div>
        ))}
      </div>
    </div>
  );
}

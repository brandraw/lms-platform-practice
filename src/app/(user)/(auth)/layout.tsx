export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="max-w-[500px] mx-auto w-full p-5 border rounded-md shadow-sm">
        {children}
      </div>
    </div>
  );
}

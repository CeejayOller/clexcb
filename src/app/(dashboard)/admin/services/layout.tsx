export default function ServicesLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="p-6">
        <nav className="mb-6">
          {/* Services navigation if needed */}
        </nav>
        {children}
      </div>
    );
  }
  
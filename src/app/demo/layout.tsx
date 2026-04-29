export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="demo-mode-container overflow-x-hidden w-full relative">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden !important;
          width: 100% !important;
          height: 100% !important;
          -webkit-overflow-scrolling: touch;
        }
        /* Hide scrollbars for a cleaner look in showcase if possible, 
           but allow vertical scroll for the content */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      {children}
    </div>
  );
}

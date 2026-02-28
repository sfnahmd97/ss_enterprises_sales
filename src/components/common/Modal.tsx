interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function Modal({
  open,
  onClose,
  children,
  title,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  const sizeClasses: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "w-full h-full mx-4",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`
          bg-white rounded-xl shadow-lg p-4 md:p-6 relative w-full max-h-[90vh] overflow-y-auto
          ${sizeClasses[size]}
          ${size === "full" ? "h-auto" : ""}
        `}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          ✖
        </button>

        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {children}
      </div>
    </div>
  );
}

// src/components/ConnectionStatus.tsx
import { Monitor, Smartphone, ChevronRight } from "lucide-react";

interface ConnectionStatusProps {
  isActive: boolean;
  deviceId: string;
  onTransferPlayback: () => void;
}

export default function ConnectionStatus({
  isActive,
  deviceId,
  onTransferPlayback,
}: ConnectionStatusProps) {
  if (isActive) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t  to-transparent p-6 z-20">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          {deviceId && (
            <div
              onClick={onTransferPlayback}
              className="flex items-center gap-3 p-4 border-t border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              <Monitor className="w-6 h-6 text-gray-300" />
              <span className="text-white font-medium flex-1">Vyl</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Available to Play on your devices
        </p>
      </div>
    </div>
  );
}

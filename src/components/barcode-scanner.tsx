"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);
  const scanningRef = useRef(false);

  // Store latest onScan in a ref so the effect doesn't re-run when the parent
  // re-creates the callback (which would stop/restart the camera).
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setStarting(false);

        // Use BarcodeDetector if available (Chrome, Safari, Edge)
        if ("BarcodeDetector" in window) {
          const detector = new BarcodeDetector({
            formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
          });
          const scan = async () => {
            if (cancelled || !videoRef.current || scanningRef.current) return;
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0 && barcodes[0].rawValue) {
                scanningRef.current = true;
                onScanRef.current(barcodes[0].rawValue);
                return;
              }
            } catch {
              // frame not ready
            }
            if (!cancelled) requestAnimationFrame(scan);
          };
          requestAnimationFrame(scan);
        } else {
          // Fallback: use html5-qrcode
          const { Html5Qrcode } = await import("html5-qrcode");
          const scannerId = "barcode-scanner-fallback";
          // Create a hidden div for html5-qrcode
          let div = document.getElementById(scannerId);
          if (!div) {
            div = document.createElement("div");
            div.id = scannerId;
            div.style.display = "none";
            document.body.appendChild(div);
          }
          const html5QrCode = new Html5Qrcode(scannerId);
          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
              if (!scanningRef.current) {
                scanningRef.current = true;
                html5QrCode.stop().catch(() => {});
                onScanRef.current(decodedText);
              }
            },
            () => {} // ignore errors during scanning
          );
          // Stop camera from our ref since html5-qrcode manages its own
          stopCamera();
        }
      } catch {
        if (!cancelled) {
          setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
          setStarting(false);
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      stopCamera();
    };
    // Only run once on mount — onScan is accessed via ref above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">Scanner un code-barres</p>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { stopCamera(); onClose(); }}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={onClose}>Fermer</Button>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          {starting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          {/* Scan guide overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-24 border-2 border-white/60 rounded-lg" />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-2">
        Placez le code-barres du produit dans le cadre
      </p>
    </div>
  );
}

// Type declaration for BarcodeDetector
declare global {
  interface Window {
    BarcodeDetector?: typeof BarcodeDetector;
  }

  class BarcodeDetector {
    constructor(options?: { formats: string[] });
    detect(source: HTMLVideoElement | HTMLImageElement | ImageBitmap): Promise<{ rawValue: string }[]>;
  }
}

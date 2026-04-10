"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

// Stable DOM id for the html5-qrcode scanner region.
const SCANNER_REGION_ID = "barcode-scanner-region";

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);
  const scannedRef = useRef(false);

  // Keep latest onScan in a ref so the effect only mounts once.
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scanner: any = null;

    (async () => {
      try {
        const mod = await import("html5-qrcode");
        if (!mounted) return;
        scanner = new mod.Html5Qrcode(SCANNER_REGION_ID, {
          verbose: false,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const width = Math.floor(minEdge * 0.85);
              const height = Math.floor(width * 0.45);
              return { width, height };
            },
            aspectRatio: 1.3,
          },
          (decodedText: string) => {
            if (scannedRef.current) return;
            scannedRef.current = true;
            onScanRef.current(decodedText);
          },
          () => {
            // Ignore per-frame decode errors
          }
        );

        if (mounted) setStarting(false);
      } catch {
        if (mounted) {
          setError(
            "Impossible d'accéder à la caméra. Vérifiez les permissions du navigateur."
          );
          setStarting(false);
        }
      }
    })();

    return () => {
      mounted = false;
      if (scanner) {
        try {
          if (scanner.isScanning) {
            scanner
              .stop()
              .then(() => {
                try {
                  scanner.clear();
                } catch {
                  /* noop */
                }
              })
              .catch(() => {
                /* noop */
              });
          } else {
            try {
              scanner.clear();
            } catch {
              /* noop */
            }
          }
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">Scanner un code-barres</p>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error ? (
        <div className="text-center py-8">
          <p className="text-sm text-destructive mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div
            id={SCANNER_REGION_ID}
            className="rounded-lg overflow-hidden bg-black w-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
          />
          {starting && (
            <p className="absolute inset-0 flex items-center justify-center text-white/80 text-sm pointer-events-none">
              Activation de la caméra…
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-2">
        Placez le code-barres du produit dans le cadre
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type BarcodeScannerProps = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

// Quagga2 mounts the <video> + <canvas> inside the element it's given.
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
    let Quagga: any = null;
    let started = false;
    // Track recent codes: EAN-13 requires 2 consecutive identical reads to
    // confirm, which dramatically reduces false positives.
    const recent: string[] = [];

    (async () => {
      try {
        const mod = await import("@ericblade/quagga2");
        Quagga = mod.default;
        if (!mounted) return;

        const target = document.getElementById(SCANNER_REGION_ID);
        if (!target) {
          throw new Error("scanner region missing");
        }

        await new Promise<void>((resolve, reject) => {
          Quagga.init(
            {
              inputStream: {
                name: "Live",
                type: "LiveStream",
                target,
                constraints: {
                  facingMode: "environment",
                  width: { ideal: 1280 },
                  height: { ideal: 720 },
                  aspectRatio: { ideal: 16 / 9 },
                },
                area: {
                  // Scan only the central horizontal band (better for 1D).
                  top: "25%",
                  right: "5%",
                  left: "5%",
                  bottom: "25%",
                },
              },
              locator: {
                patchSize: "medium",
                halfSample: true,
              },
              numOfWorkers: typeof navigator !== "undefined" && navigator.hardwareConcurrency
                ? Math.min(4, navigator.hardwareConcurrency)
                : 2,
              frequency: 10,
              decoder: {
                readers: [
                  "ean_reader",
                  "ean_8_reader",
                  "upc_reader",
                  "upc_e_reader",
                  "code_128_reader",
                  "code_39_reader",
                  "code_93_reader",
                  "i2of5_reader",
                  "codabar_reader",
                ],
              },
              locate: true,
            },
            (err: Error | null) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });

        if (!mounted) {
          try {
            Quagga.stop();
          } catch {
            /* noop */
          }
          return;
        }

        Quagga.start();
        started = true;
        setStarting(false);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Quagga.onDetected((result: any) => {
          if (scannedRef.current) return;
          const code = result?.codeResult?.code;
          if (!code) return;

          // Require 2 identical reads within the last 5 before accepting.
          recent.push(code);
          if (recent.length > 5) recent.shift();
          const occurrences = recent.filter((c) => c === code).length;
          if (occurrences < 2) return;

          scannedRef.current = true;
          try {
            onScanRef.current(code);
          } catch (e) {
            console.error("[barcode-scanner] onScan threw", e);
          }
        });
      } catch (e) {
        console.error("[barcode-scanner] Quagga init failed", e);
        if (mounted) {
          setError(
            "Impossible d'accéder à la caméra. Vérifiez les permissions du navigateur (HTTPS requis sur mobile)."
          );
          setStarting(false);
        }
      }
    })();

    return () => {
      mounted = false;
      if (Quagga) {
        try {
          if (started) Quagga.stop();
          Quagga.offDetected();
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
            className="rounded-lg overflow-hidden bg-black w-full aspect-video [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>canvas.drawingBuffer]:hidden"
          />
          {/* Scan guide overlay (wide horizontal band for 1D barcodes). */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[90%] h-[40%] border-2 border-white/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
          </div>
          {starting && (
            <p className="absolute inset-0 flex items-center justify-center text-white/90 text-sm pointer-events-none bg-black/40">
              Activation de la caméra…
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-2">
        Cadrez le code-barres horizontalement, à 15–20 cm de l&apos;objectif
      </p>
    </div>
  );
}

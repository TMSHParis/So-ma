"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { FileText, Download, X } from "lucide-react";

function isPdf(url: string) {
  return url.toLowerCase().includes(".pdf");
}

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(url);
}

export function FileViewer({
  open,
  onClose,
  fileUrl,
  fileName,
}: {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName?: string;
}) {
  const name = fileName || "Document";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 shrink-0 text-primary" />
            <DialogTitle className="text-sm font-medium truncate">{name}</DialogTitle>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={buttonVariants({ variant: "ghost", size: "icon" }) + " h-8 w-8"}
            >
              <Download className="h-4 w-4" />
            </a>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-muted/30">
          {isPdf(fileUrl) ? (
            <iframe src={fileUrl} className="w-full h-full border-0" title={name} />
          ) : isImage(fileUrl) ? (
            <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl} alt={name} className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <FileText className="h-16 w-16 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Aperçu non disponible pour ce type de fichier.</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className={buttonVariants({ variant: "default" })}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

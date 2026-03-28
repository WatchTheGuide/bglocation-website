"use client";

import { useState, useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface CheckoutDialogProps {
  checkoutUrl: string;
  planName: string;
  price: string;
  buttonVariant?: "default" | "outline";
  buttonLabel: string;
}

export function CheckoutDialog({
  checkoutUrl,
  planName,
  price,
  buttonVariant = "outline",
  buttonLabel,
}: CheckoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    function handleMessage(event: MessageEvent) {
      try {
        const url = new URL(event.origin);
        if (!url.hostname.endsWith(".lemonsqueezy.com")) return;
      } catch {
        return;
      }

      const data =
        typeof event.data === "string"
          ? (() => {
              try {
                return JSON.parse(event.data);
              } catch {
                return null;
              }
            })()
          : event.data;

      if (data?.event === "Checkout.Success") {
        setOpen(false);
        window.location.href = "/portal";
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open]);

  return (
    <>
      <Button
        className="w-full"
        variant={buttonVariant}
        size="lg"
        onClick={() => {
          setLoading(true);
          setOpen(true);
        }}
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex h-[min(90vh,700px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md md:max-w-lg"
        >
          <div className="flex items-center border-b px-4 py-3">
            <div>
              <DialogTitle>{planName} — {price}</DialogTitle>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3 w-3" />
                Secure checkout via Lemon Squeezy
              </p>
            </div>
          </div>

          <div className="relative flex-1">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            <iframe
              src={checkoutUrl}
              className="h-full w-full"
              onLoad={() => setLoading(false)}
              title={`${planName} Checkout`}
              allow="payment"
              sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

export function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [countdown, setCountdown] = useState(4);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAccept = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-[#1a1d26] border-[#2a2d3a] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold mb-4">
            Welcome to use
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="w-full h-px bg-white mb-4" />

          <p className="text-gray-300 text-center leading-relaxed">
            Due to policy reasons, services are not provided to North Korea,
            Israel, China, Vanuatu, and Cuba.
          </p>

          <Button
            onClick={handleAccept}
            className="w-full bg-[#83bb06] hover:bg-[#6fa005] text-white h-12 text-lg font-semibold mt-6"
          >
            Accept{countdown > 0 ? ` (countdown ${countdown}s)` : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import EnvelopeCover from "./EnvelopeCover";

interface ModernBlueCoverProps {
  guestName?: string;
  onOpen: () => void;
  bride: string;
  groom: string;
  date: string;
}

export default function ModernBlueCover({ guestName, onOpen, bride, groom, date }: ModernBlueCoverProps) {
  return (
    <EnvelopeCover 
      variant="modern-blue"
      guestName={guestName}
      onOpen={onOpen}
      bride={bride}
      groom={groom}
      date={date}
    />
  );
}

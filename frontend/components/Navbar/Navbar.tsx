"use client";

import { Menu } from "lucide-react";

import { CreateMeetingModal } from "@/components/MeetingForm/CreateMeetingModal";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-navbar/85 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button className="lg:hidden" size="icon" variant="ghost" aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <CreateMeetingModal />
      </div>
    </header>
  );
}


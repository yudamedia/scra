"use client";

import { useState } from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type PersonCardProps = {
  name: string;
  role: string;
  photoUrl?: string | null;
  photoAlt?: string | null;
  bio?: SerializedEditorState | null;
};

export function PersonCard({ name, role, photoUrl, photoAlt, bio }: PersonCardProps) {
  const [showBio, setShowBio] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow p-8">
      <div className="flex items-center gap-4 mb-4">
        {photoUrl && (
          <img
            src={photoUrl}
            alt={photoAlt ?? name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        )}
        <div>
          <h2 className="text-primary text-xl mb-1">{name}</h2>
          <p className="text-secondary font-semibold text-sm">{role}</p>
        </div>
      </div>

      {bio && (
        <>
          <button
            type="button"
            onClick={() => setShowBio((v) => !v)}
            className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            aria-expanded={showBio}
          >
            {showBio ? "Hide bio" : "Read bio"}
          </button>
          {showBio && (
            <div className="prose max-w-none text-muted-foreground text-sm mt-4 [&_p]:mb-3 [&_p]:leading-relaxed">
              <RichText data={bio} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

import React from "react";

interface PageTitleProps {
  title: string; // The title text
  emoji?: string; // Emoji to display next to the title
  description: string; // The description text
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, emoji, description }) => {
  return (
    <div className="text-center flex flex-col gap-7">
      <div className="flex justify-center gap-1">
        <div className="text-4xl sm:text-5xl mt-0 sm:mt-2">{emoji}</div>
        <h1 className="text-4xl sm:text-6xl mb-0 font-paytone">{title}</h1>
      </div>
      <div className="text-center text-xl md:text-2xl">{description}</div>
    </div>
  );
};

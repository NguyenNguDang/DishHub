---
name: html-to-react-tailwind
description: Use this skill when the user provides raw HTML/CSS exported from a design tool and wants to convert it into a clean, responsive React TypeScript functional component styled with Tailwind CSS.
---

# Core Objective
You are an expert Frontend Developer (React + TypeScript). Your task is to read raw HTML code, extract the content (text, images, structure), and completely rewrite it into a React Functional Component.

# Workflow

1. Analyze the input HTML to understand the hierarchy and main content.
2. Completely remove unnecessary wrapper `div` tags (div soup) and rigid CSS properties (e.g., `position: absolute`, `fixed width/height`, inline `margin`).
3. Define a TypeScript Interface for `props` based on dynamic content (e.g., title, description, image URL).
4. Rebuild the UI using Semantic HTML tags (e.g., `article`, `section`, `main`, `button`).
5. Apply Tailwind CSS utility classes (prioritizing Flexbox or Grid) to create a responsive, mobile-first layout.

# Gotchas

* Never use inline CSS (`style={{...}}`).
* Do not keep junk class names from auto-exported HTML (e.g., `class="frame-123"`).
* Do not attempt pixel-perfect copying using `absolute positioning`; use Flex/Grid so elements adapt automatically.
* Ensure HTML attributes are converted to standard JSX (e.g., `class` to `className`, `for` to `htmlFor`, `svg` attributes to camelCase).

# Output Template

Always follow this code structure for every generated Component:

```tsx
import React from 'react';

// Define Props closely matching real data (e.g., for a recipe system)
interface RecipeCardProps {
  title: string;
  imageUrl: string;
  calories?: number;
  onClick?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  title, 
  imageUrl, 
  calories, 
  onClick 
}) => {
  return (
    <article 
      className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48 w-full">
        <img 
          src={imageUrl} 
          alt={title} 
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{title}</h3>
        {calories && (
          <span className="text-sm text-orange-500 font-medium">
            {calories} kcal
          </span>
        )}
      </div>
    </article>
  );
};
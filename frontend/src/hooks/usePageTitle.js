import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title =
      title === 'BCA & MCA Project Showcase'
        ? 'Integral University | BCA & MCA Project Showcase'
        : `${title} | Integral University Project Showcase`;
  }, [title]);
}

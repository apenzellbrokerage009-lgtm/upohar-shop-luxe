
import React, { useEffect } from 'react';
import { CustomLandingPage } from '../types';

interface ViewProps {
  page: CustomLandingPage;
}

const CustomLandingView: React.FC<ViewProps> = ({ page }) => {
  useEffect(() => {
    // Inject custom CSS
    const styleId = `custom-landing-css-${page.id}`;
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = page.css;

    // Inject custom JS
    const scriptId = `custom-landing-js-${page.id}`;
    let script = document.getElementById(scriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      document.body.appendChild(script);
    }
    script.innerHTML = `(function() { ${page.js} })();`;

    return () => {
      style?.remove();
      script?.remove();
    };
  }, [page]);

  return (
    <div className="custom-landing-container min-h-screen bg-white">
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
};

export default CustomLandingView;

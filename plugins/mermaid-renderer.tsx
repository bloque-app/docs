import React, { useEffect, useRef } from 'react';

export default function MermaidRenderer() {
  const isMounted = useRef(true);
  const observerRef = useRef<MutationObserver | null>(null);
  const isRenderingRef = useRef(false);
  const initializedRef = useRef(false);

  // Initialize Mermaid once with neutral theme for compatibility with both light and dark modes
  useEffect(() => {
    const initializeMermaid = async () => {
      if (initializedRef.current) return;

      try {
        const mermaid = await import('mermaid');

        if (!isMounted.current) return;

        // Use 'neutral' theme - works best with both light and dark page themes
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'neutral', // Fixed neutral theme for visual harmony
          securityLevel: 'loose',
          fontFamily: 'monospace',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
        });

        function renderMermaidDiagrams() {
          // Only look for blocks that haven't been processed yet
          const unprocessedCodeBlocks = document.querySelectorAll(
            'pre:not([data-mermaid-processed]) code',
          );
          let foundCount = 0;

          // Cache the mermaid patterns for better performance
          const mermaidPatterns = [
            'graph',
            'flowchart',
            'stateDiagram',
            'sequenceDiagram',
            'classDiagram',
            'gantt',
            'pie',
            'gitGraph',
            'erDiagram',
            'journey',
            'mindmap',
          ];

          unprocessedCodeBlocks.forEach((codeElement) => {
            const preElement = codeElement.parentElement;
            if (!preElement) return;

            const code = codeElement.textContent || '';
            const trimmedCode = code.trim();

            // Check if it's mermaid code - optimized checks
            const isMermaid =
              codeElement.className.includes('mermaid') ||
              preElement.className.includes('mermaid') ||
              mermaidPatterns.some((pattern) =>
                trimmedCode.startsWith(pattern),
              ) ||
              trimmedCode.includes('stateDiagram-v2');

            if (isMermaid) {
              foundCount++;

              // Create a div with class mermaid
              const mermaidDiv = document.createElement('div');
              mermaidDiv.className = 'mermaid';
              mermaidDiv.textContent = trimmedCode;

              // Mark as processed before replacing
              preElement.setAttribute('data-mermaid-processed', 'true');
              // Replace pre element
              preElement.replaceWith(mermaidDiv);
            }
          });

          return foundCount;
        }

        // Wait for DOM to be completely ready
        setTimeout(async () => {
          if (!isMounted.current || isRenderingRef.current) return;

          isRenderingRef.current = true;
          try {
            const newBlocks = renderMermaidDiagrams();
            if (newBlocks > 0 && isMounted.current) {
              try {
                await mermaid.default.run();
              } catch (error) {
                console.error('Failed to render mermaid diagrams:', error);
              }
            }
          } finally {
            isRenderingRef.current = false;
            initializedRef.current = true;
          }
        }, 500);
      } catch (err) {
        console.error('Failed to initialize mermaid:', err);
      }
    };

    initializeMermaid();
  }, []); // Initialize only once

  // Cleanup and MutationObserver setup
  useEffect(() => {
    // Set up MutationObserver for dynamic content
    observerRef.current = new MutationObserver((mutations) => {
      const hasNewMermaid = mutations.some((mutation) =>
        Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            ((node as Element).tagName === 'PRE' ||
              (node as Element).querySelector?.('pre') ||
              (node as Element).classList?.contains('mermaid')),
        ),
      );

      if (hasNewMermaid && isMounted.current && !isRenderingRef.current) {
        // Debounce to prevent rapid successive calls
        setTimeout(async () => {
          if (!isMounted.current || isRenderingRef.current) return;

          isRenderingRef.current = true;
          try {
            const mermaid = await import('mermaid');
            if (isMounted.current) {
              try {
                await mermaid.default.run();
              } catch (error) {
                console.error(
                  'Failed to render mermaid diagrams from mutation:',
                  error,
                );
              }
            }
          } catch (error) {
            console.error('Failed to import mermaid:', error);
          } finally {
            isRenderingRef.current = false;
          }
        }, 100); // Small debounce delay
      }
    });

    // Start observing the document body
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      isMounted.current = false;
      isRenderingRef.current = false;
      initializedRef.current = false;

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Clean up existing Mermaid diagrams
      const mermaidElements = document.querySelectorAll('.mermaid');
      mermaidElements.forEach((element) => {
        element.innerHTML = '';
      });
    };
  }, []);

  return null; // No visual output, just side effects
}

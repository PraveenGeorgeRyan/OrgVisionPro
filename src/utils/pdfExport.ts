import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helper function to process DOM before capture
const preprocessDom = (element: HTMLElement): () => void => {
  // Store original styles to restore later
  const originalStyles = new Map<HTMLElement, string>();
  const originalClasses = new Map<HTMLElement, string>();
  
  // Find all elements with oklch colors or truncated text
  const allElements = element.querySelectorAll('*');
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computedStyle = window.getComputedStyle(htmlEl);
    const bgColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    // Store original state
    originalStyles.set(htmlEl, htmlEl.style.cssText);
    if (htmlEl.className) {
      originalClasses.set(htmlEl, htmlEl.className);
    }
    
    // Fix color issues
    if (bgColor.includes('oklch') || color.includes('oklch')) {
      // Use safe colors for the export
      if (bgColor.includes('oklch')) {
        htmlEl.style.backgroundColor = bgColor.includes('rgba(0, 0, 0, 0)') ? '#ffffff' : '#14b8a6'; // Default teal color
      }
      
      if (color.includes('oklch')) {
        htmlEl.style.color = '#ffffff'; // Default to white for text
      }
    }
    
    // Fix truncated text by removing truncate classes
    try {
      if (htmlEl.classList.contains('truncate')) {
        // Handle SVG elements differently
        if (htmlEl instanceof SVGElement) {
          const classes = htmlEl.getAttribute('class')?.split(' ') || [];
          const newClasses = classes.filter(c => c !== 'truncate').join(' ');
          htmlEl.setAttribute('class', newClasses);
        } else {
          htmlEl.classList.remove('truncate');
        }
        
        // Ensure adequate width for text display
        if (htmlEl.tagName.toLowerCase() === 'h3' || htmlEl.tagName.toLowerCase() === 'p') {
          htmlEl.style.minWidth = 'auto';
          htmlEl.style.whiteSpace = 'normal';
          htmlEl.style.overflow = 'visible';
        }
      }
    } catch (error) {
      console.warn('Could not process truncate class for element', htmlEl, error);
    }
    
    // Add data attribute for PDF export to modify card rendering
    if (htmlEl.getAttribute('data-component-name') === 'EmployeeCard') {
      htmlEl.setAttribute('data-for-pdf-export', 'true');
    }
  });
  
  return () => {
    // Restore original styles and classes
    originalStyles.forEach((style, el) => {
      el.style.cssText = style;
    });
    
    originalClasses.forEach((className, el) => {
      try {
        // Handle SVG elements differently (they have getter-only className)
        if (el instanceof SVGElement) {
          // For SVG elements, use setAttribute instead
          el.setAttribute('class', className);
        } else {
          el.className = className;
        }
      } catch (error) {
        console.warn('Could not restore class for element', el, error);
      }
    });
    
    // Remove PDF export data attributes
    element.querySelectorAll('[data-for-pdf-export]').forEach(el => {
      el.removeAttribute('data-for-pdf-export');
    });
  };
  
};

/**
 * Exports the specified DOM element as a PDF
 * @param elementId The ID of the element to export
 * @param fileName The name for the downloaded file (without extension)
 */
export const exportToPdf = async (elementId: string, fileName: string = 'orgvision-export'): Promise<void> => {
  try {
    // Find the element to export
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }
    
    // Preprocess DOM to handle oklch colors
    const restoreStyles = preprocessDom(element);
    
    try {
      // Create canvas from the DOM element
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for loading images from different domains
        logging: false,
        backgroundColor: '#ffffff',
      });
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Add the current date to the PDF
    const date = new Date().toLocaleDateString();
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${date}`, 10, 10);
    
    // Add organization tree image
    pdf.addImage(imgData, 'PNG', 0, 15, imgWidth, imgHeight);
    
      // Download PDF
      pdf.save(`${fileName}.pdf`);
      
      return Promise.resolve();
    } finally {
      // Restore original styles regardless of success or failure
      restoreStyles();
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
    return Promise.reject(error);
  }
};

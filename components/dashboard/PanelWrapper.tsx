'use client';

import { useState, useRef } from 'react';
import { useDashboard } from '@/components/layout/DashboardContext';

export interface PanelProps {
  panelId: string;
  colSpan: number;
  rowSpan: number;
  onResize: (panelId: string, colSpan: number, rowSpan: number) => void;
}

export function PanelWrapper({ panelId, colSpan, rowSpan, onResize, children }: PanelProps & { children: React.ReactNode }) {
  const { isEditMode } = useDashboard();
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewSize, setPreviewSize] = useState<{ col: number; row: number } | null>(null);
  const previewSizeRef = useRef<{ col: number; row: number } | null>(null);

  const activeColSpan = previewSize ? previewSize.col : colSpan;
  const activeRowSpan = previewSize ? previewSize.row : rowSpan;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragging(true);
    setPreviewSize({ col: colSpan, row: rowSpan });
    previewSizeRef.current = { col: colSpan, row: rowSpan };

    document.body.classList.add('is-resizing-grid');

    const startX = e.clientX;
    const startY = e.clientY;
    const startCol = colSpan;
    const startRow = rowSpan;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      const gridContainer = ref.current?.parentElement;
      const containerWidth = gridContainer ? gridContainer.clientWidth : 1200;
      const cellWidth = (containerWidth + 8) / 12; 
      const cellHeight = 24 + 16; // row + gap

      let newCol = startCol + Math.round(dx / cellWidth);
      let newRow = startRow + Math.round(dy / cellHeight);

      newCol = Math.max(2, Math.min(12, newCol));
      newRow = Math.max(2, Math.min(30, newRow));

      const newSize = { col: newCol, row: newRow };
      previewSizeRef.current = newSize;
      setPreviewSize(newSize);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove('is-resizing-grid');
      
      const finalSize = previewSizeRef.current;
      if (finalSize && (finalSize.col !== colSpan || finalSize.row !== rowSpan)) {
        onResize(panelId, finalSize.col, finalSize.row);
      }
      
      setPreviewSize(null);
      previewSizeRef.current = null;
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      ref={ref}
      className={`group relative h-full transition-all duration-200 ${isDragging ? 'z-50' : 'z-10'} panel-wrapper-responsive`}
      style={{
        gridColumn: `span ${activeColSpan} / span ${activeColSpan}`,
        gridRow: `span ${activeRowSpan} / span ${activeRowSpan}`
      }}
    >
      {isDragging && (
        <div className="absolute inset-0 border-2 border-dashed border-[var(--accent)] rounded-xl pointer-events-none z-50 bg-[var(--accent)] bg-opacity-5" />
      )}
      
      {children}

      {isEditMode && (
        <div 
          className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize flex items-end justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity z-40 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          onMouseDown={handleMouseDown}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="10" y1="0" x2="0" y2="10" />
            <line x1="10" y1="5" x2="5" y2="10" />
          </svg>
        </div>
      )}
    </div>
  );
}

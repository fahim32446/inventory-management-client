import {
  BoldOutlined,
  CloseOutlined,
  BgColorsOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  PushpinOutlined,
  PushpinFilled,
} from '@ant-design/icons';
import { Button, ColorPicker, Tooltip } from 'antd';
import { Rnd } from 'react-rnd';
import { useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

export interface Note {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  zIndex: number;
  isPinned: boolean;
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
  onFocus,
}: StickyNoteProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Apply initial content
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== note.content) {
      contentRef.current.innerHTML = note.content;
    }
  }, []);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (contentRef.current) {
        onUpdate(note.id, { content: contentRef.current.innerHTML });
        contentRef.current.focus();
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      console.log(contentRef.current.innerHTML);
      
      onUpdate(note.id, { content: contentRef.current.innerHTML });
    }
  };

  return (
    <Rnd
      size={{ width: note.width, height: note.height }}
      position={{ x: note.x, y: note.y }}
      onDragStop={(_e, d) => {
        onUpdate(note.id, { x: d.x, y: d.y });
        onFocus(note.id);
      }}
      onResizeStop={(_e, _direction, ref, _delta, position) => {
        onUpdate(note.id, {
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...position,
        });
        onFocus(note.id);
      }}
      bounds="window"
      minWidth={200}
      minHeight={150}
      dragHandleClassName="drag-handle"
      style={{ zIndex: note.zIndex, position: 'fixed' }}
      onMouseDown={() => onFocus(note.id)}
    >
      <div
        className={cn(
          'flex flex-col w-full h-full shadow-lg rounded-lg overflow-hidden transition-shadow duration-200',
           "border border-gray-200/20"
        )}
        style={{ backgroundColor: note.color }}
      >
        {/* Header / Toolbar */}
        <div
          className="drag-handle h-8 cursor-move flex items-center justify-between px-2 bg-black/5 dark:bg-white/10 select-none"
          onDoubleClick={() => onUpdate(note.id, { isPinned: !note.isPinned })}
        >
            <div className="flex items-center gap-1">
                 <Button
                    type="text"
                    size="small"
                    className="flex items-center justify-center w-6 h-6 hover:bg-black/10"
                    icon={note.isPinned ? <PushpinFilled className="text-blue-600" /> : <PushpinOutlined className="text-gray-600 dark:text-gray-300"/>}
                    onClick={() => onUpdate(note.id, { isPinned: !note.isPinned })}
                />
            </div>
          <div className="flex items-center gap-1 no-drag">
             <ColorPicker
                value={note.color}
                onChange={(c) => onUpdate(note.id, { color: c.toHexString() })}
                size="small"
                trigger="click"
              >
                  <Button type="text" size="small" icon={<BgColorsOutlined className="text-gray-600 dark:text-gray-300" />} />
              </ColorPicker>

            <Button
              type="text"
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id)
              }}
            />
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1 border-b border-black/5 bg-black/5 dark:bg-white/5">
            <Tooltip title="Bold">
                <Button type="text" size="small" onMouseDown={(e) => { e.preventDefault(); handleCommand('bold'); }} icon={<BoldOutlined/>} />
            </Tooltip>
            <Tooltip title="Italic">
                <Button type="text" size="small" onMouseDown={(e) => { e.preventDefault(); handleCommand('italic'); }} icon={<ItalicOutlined/>} />
            </Tooltip>
             <Tooltip title="List">
                <Button type="text" size="small" onMouseDown={(e) => { e.preventDefault(); handleCommand('insertUnorderedList'); }} icon={<UnorderedListOutlined/>} />
            </Tooltip>
        </div>

        {/* Content Area */}
        <div
          ref={contentRef}
          contentEditable
          className="flex-1 p-3 outline-none overflow-y-auto text-gray-800 dark:text-gray-100"
          onInput={handleContentChange}
          onFocus={() => {
              onFocus(note.id);
          }}
          suppressContentEditableWarning
          style={{
              fontFamily: 'sans-serif',
              lineHeight: '1.5',
          }}
        />
      </div>
    </Rnd>
  );
}

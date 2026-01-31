import {
  BoldOutlined,
  CloseOutlined,
  ItalicOutlined,
  PlusOutlined,
  PushpinFilled,
  PushpinOutlined,
  UnorderedListOutlined,
  BellOutlined,
  BellFilled,
  ClearOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Tooltip, DatePicker, Popover } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { ColorDropdown } from './color-drop-down';
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
  reminder?: string;
  isNotified?: boolean;
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onFocus: (id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  addNote: () => void;
}

const FONT_SIZES = [
  { label: 'Small', value: '2' },
  { label: 'Medium', value: '3' },
  { label: 'Large', value: '5' },
];

const COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
];

export function StickyNote({ note, onUpdate, onDelete, onFocus, addNote }: StickyNoteProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();

    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection.current);
    }
  };

  // Apply initial content
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== note.content) {
      contentRef.current.innerHTML = note.content;
    }
  }, []);

  const handleCommand = (command: string, value?: string) => {
    restoreSelection();
    document.execCommand(command, false, value);
    saveSelection();
    if (contentRef.current) {
      onUpdate(note.id, { content: contentRef.current.innerHTML });
      contentRef.current.focus();
    }
  };

  const handleContentChange = () => {
    if (contentRef.current) {
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
      bounds='window'
      minWidth={200}
      minHeight={150}
      dragHandleClassName='drag-handle'
      style={{ zIndex: note.zIndex, position: 'fixed' }}
      onMouseDown={() => onFocus(note.id)}
    >
      <div
        className={cn(
          'flex flex-col w-full h-full shadow-lg rounded-lg overflow-hidden transition-shadow duration-200',
          'border border-gray-200/20',
        )}
        style={{ backgroundColor: note.color }}
      >
        {/* Header / Toolbar */}
        <div className='drag-handle h-8 cursor-move flex items-center justify-between px-2 bg-black/5 select-none'>
          <div className='flex items-center gap-1'>
            <Button
              type='text'
              size='small'
              className='flex items-center justify-center w-6 h-6 hover:bg-black/10'
              icon={
                note.isPinned ? (
                  <PushpinFilled className='text-blue-600' />
                ) : (
                  <PushpinOutlined className='text-gray-600' />
                )
              }
              onClick={() => onUpdate(note.id, { isPinned: !note.isPinned })}
            />
          </div>
          <div className='flex items-center gap-1 no-drag'>
            <Tooltip
              title={
                note.reminder
                  ? `Reminder: ${dayjs(note.reminder).format('YYYY-MM-DD HH:mm')}`
                  : 'Set Reminder'
              }
            >
              <Popover
                content={
                  <div className='p-1 flex flex-col gap-2'>
                    <DatePicker
                      showTime
                      size='small'
                      value={note.reminder ? dayjs(note.reminder) : null}
                      onChange={(date) => {
                        onUpdate(note.id, {
                          reminder: date ? date.toISOString() : undefined,
                          isNotified: false,
                        });
                      }}
                    />
                    {note.reminder && (
                      <Button
                        size='small'
                        danger
                        type='link'
                        onClick={() =>
                          onUpdate(note.id, { reminder: undefined, isNotified: false })
                        }
                      >
                        Clear reminder
                      </Button>
                    )}
                  </div>
                }
                trigger='click'
                placement='bottomRight'
              >
                <Button
                  type='text'
                  size='small'
                  className='flex items-center justify-center w-6 h-6 hover:bg-black/10'
                  icon={
                    note.reminder ? (
                      <BellFilled className='text-yellow-600' />
                    ) : (
                      <BellOutlined className='text-gray-600' />
                    )
                  }
                />
              </Popover>
            </Tooltip>
            <ColorDropdown
              value={note.color}
              onChange={(color) => {
                onUpdate(note.id, { color });
              }}
              colors={['#fdfdc0', '#ffe4e6', '#e0f2fe']}
            />
            <Tooltip title='Open a new note'>
              <Button
                type='text'
                size='small'
                icon={<PlusOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  addNote();
                }}
              />
            </Tooltip>
            <Button
              type='text'
              size='small'
              danger
              icon={<CloseOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            />
          </div>
        </div>

        <div
          className='
    flex items-center gap-1 px-2 py-1
    border-b border-black/5 bg-black/5
    overflow-x-auto
  '
        >
          {/* Bold */}
          <Tooltip title='Bold'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('bold');
              }}
              icon={<BoldOutlined />}
            />
          </Tooltip>

          {/* Italic */}
          <Tooltip title='Italic'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('italic');
              }}
              icon={<ItalicOutlined />}
            />
          </Tooltip>

          {/* Underline */}
          <Tooltip title='Underline'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('underline');
              }}
            >
              <u>U</u>
            </Button>
          </Tooltip>

          {/* Strike */}
          <Tooltip title='Strike'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('strikeThrough');
              }}
            >
              <s>S</s>
            </Button>
          </Tooltip>

          <span className='mx-1 w-px h-4 bg-black/20' />
          <Tooltip title='Font Size'>
            <Dropdown
              trigger={['click']}
              menu={{
                items: FONT_SIZES.map((size) => ({
                  key: size.value,
                  label: size.label,
                  onClick: () => handleCommand('fontSize', size.value),
                })),
              }}
            >
              <Button
                type='text'
                size='small'
                onMouseDown={(_e) => {
                  saveSelection();
                }}
              >
                Aa
              </Button>
            </Dropdown>
          </Tooltip>
          {/* LIST */}
          <Tooltip title='Bullet list'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('insertUnorderedList');
              }}
              icon={<UnorderedListOutlined />}
            />
          </Tooltip>

          <Tooltip title='Numbered list'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('insertOrderedList');
              }}
            >
              1.
            </Button>
          </Tooltip>

          <span className='mx-1 w-px h-4 bg-black/20' />

          {/* TEXT COLOR DROPDOWN */}

          <Tooltip title='Text Color'>
            <Dropdown
              trigger={['click']}
              menu={{
                items: COLORS.map((c) => ({
                  key: c.value,
                  label: (
                    <div className='flex items-center gap-2'>
                      <span
                        className='w-3 h-3 rounded-full border'
                        style={{ backgroundColor: c.value }}
                      />
                      {c.name}
                    </div>
                  ),
                  onClick: () => handleCommand('foreColor', c.value),
                })),
              }}
            >
              <Button
                type='text'
                size='small'
                onMouseDown={(_e) => {
                  saveSelection();
                }}
              >
                A🎨
              </Button>
            </Dropdown>
          </Tooltip>

          {/* BACKGROUND COLOR DROPDOWN */}

          <Tooltip title='Text Fill Color'>
            <Dropdown
              trigger={['click']}
              menu={{
                items: COLORS.map((c) => ({
                  key: c.value,
                  label: (
                    <div className='flex items-center gap-2'>
                      <span
                        className='w-3 h-3 rounded border'
                        style={{ backgroundColor: c.value }}
                      />
                      {c.name}
                    </div>
                  ),
                  onClick: () => handleCommand('hiliteColor', c.value),
                })),
              }}
            >
              <Button
                type='text'
                size='small'
                onMouseDown={(_e) => {
                  saveSelection();
                }}
              >
                🖍
              </Button>
            </Dropdown>
          </Tooltip>

          <span className='mx-1 w-px h-4 bg-black/20' />

          <Tooltip title='Clear Formatting'>
            <Button
              type='text'
              size='small'
              onMouseDown={(e) => {
                e.preventDefault();
                handleCommand('removeFormat');
              }}
              icon={<ClearOutlined />}
            />
          </Tooltip>
        </div>

        {/* Content Area */}
        <div
          ref={contentRef}
          contentEditable
          className="
    flex-1 p-3 outline-none overflow-y-auto
    prose prose-sm max-w-none text-black font-sans
    [&_ul]:list-disc [&_ul]:pl-5
    [&_ol]:list-decimal [&_ol]:pl-5
    [&_font[size='2']]:text-sm
    [&_font[size='3']]:text-base
    [&_font[size='5']]:text-xl
  "
          onInput={handleContentChange}
          onBlur={saveSelection}
          onMouseUp={saveSelection}
          onKeyUp={saveSelection}
          onFocus={() => {
            onFocus(note.id);
          }}
          suppressContentEditableWarning
          style={{
            lineHeight: '1.5',
          }}
        />
      </div>
    </Rnd>
  );
}
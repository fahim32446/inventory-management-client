import { PlusOutlined, BellOutlined } from '@ant-design/icons';
import { ConfigProvider, FloatButton, theme, notification } from 'antd';
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { Note, StickyNote } from './sticky-note';

// Helper for ID generation
const generateId = () => Math.random().toString(36).substring(2, 9);

interface StickyNotesManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_COLOR = '#fdfdc0';

export function StickyNotesManager({ isOpen, onClose }: StickyNotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    if (savedNotes) {
      try {
        return JSON.parse(savedNotes);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [maxZIndex, setMaxZIndex] = useState(1000);
  const containerRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<Note[]>(notes);

  // Sync ref with state
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const OFFSET = notes.length * 20;

  const addNote = () => {
    const newNote: Note = {
      id: generateId(),
      content: 'New Note',
      x: window.innerWidth / 2 - 125 + OFFSET,
      y: window.innerHeight / 2 - 100 + OFFSET,
      width: 350,
      height: 350,
      color: DEFAULT_COLOR,
      zIndex: maxZIndex + 1,
      isPinned: false,
    };
    setNotes((prev) => [...prev, newNote]);
    setMaxZIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (notes?.length === 0) {
      const timer = setTimeout(() => {
        addNote();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updates } : note)));
  };

  // Reminder Logic (Persistent Interval)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      // Use the ref to check the latest notes without re-triggering the interval
      notesRef.current.forEach((note) => {
        if (note.reminder && !note.isNotified) {
          const reminderTime = dayjs(note.reminder);
          if (reminderTime.isBefore(now) || reminderTime.isSame(now)) {
            // Trigger notification
            notification.info({
              message: 'Sticky Note Reminder',
              description: (
                <div
                  dangerouslySetInnerHTML={{ __html: note.content }}
                  className='max-h-24 overflow-hidden text-ellipsis'
                />
              ),
              icon: <BellOutlined style={{ color: '#faad14' }} />,
              placement: 'topRight',
              duration: 0, // Stay until closed
            });

            // Mark as notified
            updateNote(note.id, { isNotified: true });
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []); // Run once on mount

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const focusNote = (id: string) => {
    setNotes((prev) => {
      const noteToFocus = prev.find((n) => n.id === id);
      if (!noteToFocus) return prev;

      // If it's already the highest z-index, don't change anything (optimization)
      if (noteToFocus.zIndex === maxZIndex) return prev;

      const nextZ = maxZIndex + 1;
      setMaxZIndex(nextZ);

      return prev.map((n) => (n.id === id ? { ...n, zIndex: nextZ } : n));
    });
  };

  // Close when clicking outside specific areas?
  // The requirement says "click outsde the sitcky note conteir it will be closed as usal"
  // But also "needs to be separate component".
  // This manager will be rendered in the DashboardLayout.
  // If isOpen is true, we show the notes.

  // Implementation strategy:
  // If isOpen is false, we render nothing (or maybe we keep them mounted but hidden? No, unmount is better or display:none)
  // "when user click the sticky note the all sitcky note will be opend toger"

  if (!isOpen && notes.length > 0 && !notes.some((n) => n.isPinned)) return null;

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      {/* Overlay for "click outside to close". 
          We only show this blocking layer IF we want modal-like behavior.
          But the user said "can be drag any where in screen".
          So we probably don't want a blocking modal overlay.
          We just want a way to detect outside clicks.
      */}
      {isOpen && (
        <div
          className='fixed inset-0 z-900'
          onClick={() => {
            // If the click is directly on this overlay, close.
            // But wait, if we click on a note, it shouldn't close.
            // The note is ON TOP of this overlay?
            // If the notes are siblings to this overlay, we need to be careful.
            // If the notes are children of this overlay, we can check e.target.

            // Better approach:
            // Notes are rendered with higher Z-index.
            // This div is an invisible backdrop.
            onClose();
          }}
        />
      )}

      {/* Add Button (Floating?) or rely on the main button?
          The prompt says: "In here user click this button a sticky note overlay will be open"
          Maybe we add a "New Note" button somewhere visible when the mode is active.
      */}
      {isOpen && (
        <FloatButton
          icon={<PlusOutlined />}
          type='primary'
          style={{ right: 24, bottom: 24, zIndex: 2000 }}
          onClick={addNote}
          tooltip='Add Sticky Note'
        />
      )}

      {/* Render Notes */}
      {/* If current state is NOT open, we only render PINNED notes? 
          "click outsde the sitcky note conteir it will be closed as usal but ... user can pin this"
          This implies pinned notes stay visible even when "closed".
      */}
      {notes.map((note) => {
        if (!isOpen && !note.isPinned) return null;

        return (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onFocus={focusNote}
            containerRef={containerRef}
            addNote={addNote}
          />
        );
      })}
    </ConfigProvider>
  );
}
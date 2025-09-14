import React, { useState, useEffect } from 'react';

const ReviewResponseModal = ({ open, onClose, onSubmit, review }) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (open) setResponse('');
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">Respond to Review</h2>
        <div className="mb-4 text-sm text-slate-700 dark:text-slate-300">
          <div className="font-medium">{review?.guest} on {review?.property}</div>
          <div className="mt-1">"{review?.comment}"</div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit(response);
          }}
          className="flex flex-col gap-3"
        >
          <textarea
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none min-h-[80px]"
            placeholder="Write your response..."
            value={response}
            onChange={e => setResponse(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Submit Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewResponseModal; 
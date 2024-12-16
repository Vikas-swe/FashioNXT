import React, { useState } from "react";
import { Dialog } from "@shadcn/ui";

function FilterPopup() {
  const [open, setOpen] = useState(false);

  // Function to handle opening the filter modal
  const openFilter = () => setOpen(true);

  // Function to handle closing the filter modal
  const closeFilter = () => setOpen(false);

  return (
    <div>
      {/* Button to open the filter */}
      <button
        onClick={openFilter}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Open Filter
      </button>

      {/* Dialog/Modal */}
      <Dialog open={open} onClose={closeFilter}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-6 bg-white rounded-lg shadow-lg">
          <Dialog.Header className="text-lg font-semibold">Filters</Dialog.Header>

          {/* Filter content (you can customize this as per your requirements) */}
          <div className="space-y-4">
            <div>
              <label className="block">Category</label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="furniture">Furniture</option>
              </select>
            </div>
            <div>
              <label className="block">Price Range</label>
              <input
                type="range"
                min="0"
                max="1000"
                className="w-full"
                step="10"
              />
            </div>
            <div>
              <label className="block">Rating</label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">Select Rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={closeFilter}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Handle filter action here
                closeFilter();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Apply Filters
            </button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export default FilterPopup;

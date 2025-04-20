import React, { RefObject } from 'react';
import { Button } from './ui/button';
import { FaFileUpload } from 'react-icons/fa';

interface FileUploadModalProps {
  fileUploadFunction: () => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setIsModalOpen: (open: boolean) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  fileUploadFunction,
  fileInputRef,
  handleFileChange,
  setIsModalOpen,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Import Students
        </h2>

        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <button
            onClick={fileUploadFunction}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow"
          >
            <FaFileUpload className="text-lg" />
            <span>Upload Excel File</span>
          </button>

          <input
            type="file"
            accept=".xlsx"
            id="fileInput"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-sm text-gray-500">
            Only .xlsx files are supported
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="border-gray-300"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;

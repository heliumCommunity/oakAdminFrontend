"use client";

import { Trash2 } from "lucide-react";
import { useRef } from "react";

// Types
interface UploadedFile {
  id: number;
  name: string;
  size: string;
  type: "image" | "pdf" | "document";
  preview?: string; // For image previews
  file?: File; // Store the original file
}

interface InstructionsData {
  additionalNotes: string;
  uploadedFiles: UploadedFile[];
  clientMaterials: boolean;
}

interface InstructionsAndReferencesProps {
  data: InstructionsData;
  onChange: (
    field: keyof InstructionsData,
    value: string | boolean | UploadedFile[]
  ) => void;
}

export const InstructionsAndDesignRefs: React.FC<
  InstructionsAndReferencesProps
> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeFile = (fileId: number) => {
    const updatedFiles = data.uploadedFiles.filter(
      (file) => file.id !== fileId
    );
    onChange("uploadedFiles", updatedFiles);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const processFiles = async () => {
      const newFiles: UploadedFile[] = [];

      for (const file of Array.from(files)) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Determine file type
        let fileType: "image" | "pdf" | "document" = "document";
        if (file.type.startsWith("image/")) {
          fileType = "image";
        } else if (file.type === "application/pdf") {
          fileType = "pdf";
        }

        // Format file size
        const formatSize = (bytes: number): string => {
          if (bytes === 0) return "0 Bytes";
          const k = 1024;
          const sizes = ["Bytes", "KB", "MB", "GB"];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
          );
        };

        const newFile: UploadedFile = {
          id: Date.now() + Math.random(), // Simple ID generation
          name: file.name,
          size: formatSize(file.size),
          type: fileType,
          file: file,
        };

        // Create preview for images synchronously
        if (fileType === "image") {
          try {
            const preview = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            newFile.preview = preview;
          } catch (error) {
            console.error("Error creating preview:", error);
          }
        }

        newFiles.push(newFile);
      }

      // Add new files to existing files
      const updatedFiles = [...data.uploadedFiles, ...newFiles];
      onChange("uploadedFiles", updatedFiles);
    };

    await processFiles();

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a synthetic event to reuse the existing upload logic
      const syntheticEvent = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;

      await handleFileUpload(syntheticEvent);
    }
  };

  const getFileIcon = (fileType: "image" | "pdf" | "document") => {
    const baseClasses = "w-4 h-4";

    switch (fileType) {
      case "image":
        return (
          <svg
            className={`${baseClasses} text-blue-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "pdf":
        return (
          <svg
            className={`${baseClasses} text-red-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={`${baseClasses} text-gray-600`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  const getFileBackgroundColor = (fileType: "image" | "pdf" | "document") => {
    switch (fileType) {
      case "image":
        return "bg-blue-50";
      case "pdf":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  const getFileIconBackgroundColor = (
    fileType: "image" | "pdf" | "document"
  ) => {
    switch (fileType) {
      case "image":
        return "bg-blue-100";
      case "pdf":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Instructions & Design References
      </h2>

      <div className="space-y-6">
        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={data.additionalNotes}
            onChange={(e) => onChange("additionalNotes", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
            placeholder="Add any special instructions, preferences, or notes for this order..."
          />
        </div>

        {/* Design References */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Design References
          </label>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />

          {/* Upload Area */}
          <div
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Upload Files</span> or drag and
                drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10mb</p>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {data.uploadedFiles.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Uploaded Files ({data.uploadedFiles.length})
            </label>

            <div className="space-y-3">
              {data.uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg ${getFileBackgroundColor(
                    file.type
                  )} hover:shadow-sm transition-shadow`}
                >
                  <div className="flex items-center space-x-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {file.type === "image" && file.preview ? (
                        <div className="relative">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded border-2 border-white shadow-sm"
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div
                            className={`w-12 h-12 ${getFileIconBackgroundColor(
                              file.type
                            )} rounded-lg flex items-center justify-center border-2 border-white shadow-sm`}
                          >
                            {getFileIcon(file.type)}
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-2 h-2 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{file.size}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            file.type === "image"
                              ? "bg-blue-100 text-blue-800"
                              : file.type === "pdf"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {file.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          Uploaded
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Materials Checkbox */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="clientMaterials"
            checked={data.clientMaterials}
            onChange={(e) => onChange("clientMaterials", e.target.checked)}
            className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 mt-0.5"
          />
          <div>
            <label
              htmlFor="clientMaterials"
              className="text-sm font-medium text-gray-900"
            >
              Client will provide materials
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Check this if the client will be providing their own fabric or
              materials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

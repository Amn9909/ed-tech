import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { FaFileUpload } from "react-icons/fa";
import FileUploadModal from './FileUploadModal';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  enrollmentNumber?: string;
  course?: string;
  batch?: string;
}

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const fetchStudents = async (page: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/students?page=${page}&limit=${ITEMS_PER_PAGE}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response.data.data);
      setTotalStudents(response.data.total);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload success:', response.data);
      setIsModalOpen(false);
      fetchStudents(currentPage);
    } catch (error) {
      setIsModalOpen(false);
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
  };

  const fileUploadFunction = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">🎓 Student Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <FaFileUpload /> Import
          </Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <FileUploadModal
          fileUploadFunction={fileUploadFunction}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {/* Table Section */}
      <main className="p-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-left">Batch</th>
                  <th className="px-6 py-3 text-left">Enrollment No.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.firstName} {student.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.course || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.batch || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.enrollmentNumber || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

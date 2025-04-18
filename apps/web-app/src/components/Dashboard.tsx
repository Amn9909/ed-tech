import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import TableContent from './ui/TableContent';

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


const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  useEffect(() => {
    fetchStudents()
    console.log(students)
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('API response:', response.data);

      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };


  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload success:', response.data);
      alert('Upload successful!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed!');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-semibold text-gray-800">Student Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={() => setIsModalOpen(true)}>Import</Button>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Import Students</h2>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="mb-4 block w-full"
            />
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              {/* Upload is triggered by input change */}
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <main className="p-6">
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Course</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Batch</th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase">Enrollment No.</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">

              {/* {
                students && <TableContent students={students}/> 
              } */}
              {students.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="px-6 py-4">{student?.firstName} {student.lastName}</td>
                  <td className="px-6 py-4">{student?.email}</td>
                  <td className="px-6 py-4">{student?.course}</td>
                  <td className="px-6 py-4">{student?.batch}</td>
                  <td className="px-6 py-4">{student?.enrollmentNumber}</td>
                </tr>
              ))}

              {Array.isArray(students) && students.length > 0 ? (
                students.map((student) =>
                (
                  <tr key={student.id} className="border-b">
                    <td className="px-6 py-4">{student.firstName} {student.lastName}</td>
                    <td className="px-6 py-4">{student.email}</td>
                    <td className="px-6 py-4">{student.course}</td>
                    <td className="px-6 py-4">{student.batch}</td>
                    <td className="px-6 py-4">{student.enrollmentNumber}</td>
                  </tr>
                )
                )
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

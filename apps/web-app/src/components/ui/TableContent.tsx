import { Student } from '../Dashboard';

const TableContent = ({ students }: { students: Student[] }) => {
  // Log students to see what is passed to this component
  console.log('Students:', students);

  // Check if students is an array before calling map
  if (!Array.isArray(students)) {
    return (
      <tbody>
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center">Invalid student data</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="text-gray-700">
      {students.length > 0 ? (
        students.map((student) => (
          <tr key={student.id} className="border-b">
            <td className="px-6 py-4">{student.firstName} {student.lastName}</td>
            <td className="px-6 py-4">{student.email}</td>
            <td className="px-6 py-4">{student.course}</td>
            <td className="px-6 py-4">{student.batch}</td>
            <td className="px-6 py-4">{student.enrollmentNumber}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="px-6 py-4 text-center">No students found</td>
        </tr>
      )}
    </tbody>
  );
};

export default TableContent;

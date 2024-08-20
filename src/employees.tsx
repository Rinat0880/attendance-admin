export interface Employee {
  id: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE'; 
  checkInTime: Date | null;
  checkOutTime: Date | null;
  location: string;
  position: string; // Новый тип для позиции
  status: 'Present' | 'Absent' | 'EarlyLeave'; // Оставляем как есть
  attendanceSummary: {
    earlyLeaves: number;
    absences: number;
    lateIns: number;
    leaves: number;
  };
}

// export const employees: Employee[] = [
//   {
//     id: 1, 
//     username: 'Cat',
//     password: 'cat123',
//     name: 'Cat',
//     photoUrl: 'images/kotek.png',
//     isAdmin: true,
//     checkInTime: new Date(),
//     checkOutTime: null,
//     location: 'example', 
//     role: 'Administrator',
//     status: 'Present'
//   },
// ];
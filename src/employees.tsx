export interface Employee {
  id: string; 
  username: string;
  password: string;
  name: string;
  photoUrl: string;
  isAdmin: boolean;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  location: string;
  role: string;
  status: 'Present' | 'Absent' | 'EarlyLeave';
}

export const employees: Employee[] = [
  {
    id: '1', 
    username: 'Cat',
    password: 'cat123',
    name: 'Cat',
    photoUrl: 'images/kotek.png',
    isAdmin: true,
    checkInTime: new Date(),
    checkOutTime: null,
    location: 'example', 
    role: 'Administrator',
    status: 'Present'
  },
];
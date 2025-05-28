type EyeColor = 'blue' | 'brown' | 'green';
type Gender = 'male' | 'female' | 'other';
type Fruit = 'apple' | 'banana' | 'strawberry';

interface Friend {
  id: number;
  name: string;
}

export interface Person {
  id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: EyeColor;
  name: string;
  gender: Gender;
  company: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  registered: string;
  latitude: number;
  longitude: number;
  tags: string[];
  friends: Friend[];
  greeting: string;
  favoriteFruit: Fruit;
}

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { type Person } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateItem } from '@/api/fetchData';

const fields: { key: keyof Person; label: string }[] = [
  { key: 'name', label: 'Имя' },
  { key: 'age', label: 'Возраст' },
  { key: 'gender', label: 'Пол' },
  { key: 'balance', label: 'Баланс' },
  { key: 'company', label: 'Компания' },
  { key: 'phone', label: 'Телефон' },
  { key: 'email', label: 'Email' },
  { key: 'about', label: 'О пользователе' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  age: z.coerce.number().min(18, 'Минимум 18 лет').max(99, 'Максимум 99 лет'),
  gender: z.string().min(1, 'Пол обязателен'),
  balance: z.string().min(1, 'Баланс обязателен'),
  company: z.string().min(1, 'Компания обязательна'),
  phone: z.string().min(1, 'Телефон обязателен'),
  email: z.string().email('Некорректный email'),
  about: z.string().min(1, 'Описание обязательно'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddUserDialog() {
  const createMutation = useCreateItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (form: FormValues) => {
    const newUser: Person = {
      ...form,
      id: crypto.randomUUID(),
      index: -1,
      guid: crypto.randomUUID(),
      isActive: true,
      picture: 'https://picsum.photos/200',
      age: Number(form.age),
      eyeColor: 'brown',
      address: '',
      registered: new Date().toISOString(),
      latitude: 0,
      longitude: 0,
      tags: [],
      friends: [],
      greeting: `Hello, ${form.name}!`,
      favoriteFruit: 'apple',
    };

    createMutation.mutate(newUser);

    reset(); // Reset form after submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Добавить пользователя</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавление пользователя</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <Label className="mb-2 block">{label}</Label>
              <Input {...register(key as keyof FormValues)} />
              {errors[key as keyof FormValues] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[key as keyof FormValues]?.message?.toString()}
                </p>
              )}
            </div>
          ))}

          <DialogFooter className="col-span-2 mt-4">
            <Button type="submit">Добавить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

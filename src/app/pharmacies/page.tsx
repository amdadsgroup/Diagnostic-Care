import { redirect } from 'next/navigation';

export default function PharmaciesPage() {
  redirect('/?tab=marketplace&category=PHARMACY');
}

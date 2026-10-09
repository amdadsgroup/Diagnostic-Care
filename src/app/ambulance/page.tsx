import { redirect } from 'next/navigation';

export default function AmbulancePage() {
  redirect('/?tab=marketplace&category=AMBULANCE&action=emergency');
}

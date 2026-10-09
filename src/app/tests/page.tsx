import { redirect } from 'next/navigation';

export default function TestsPage() {
  redirect('/?tab=marketplace&category=DIAGNOSTIC_CENTER');
}

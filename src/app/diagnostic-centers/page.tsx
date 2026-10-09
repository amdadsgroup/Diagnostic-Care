import { redirect } from 'next/navigation';

export default function DiagnosticCentersPage() {
  redirect('/?tab=marketplace&category=DIAGNOSTIC_CENTER');
}

import { redirect } from 'next/navigation';

export default function HomeCarePage() {
  redirect('/?tab=marketplace&category=HOME_CARE');
}

import HelpHandConfirm from '@/views/help_hand_confirm';
import { Suspense } from 'react';

export default function HelpHandConfirmPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <HelpHandConfirm />
    </Suspense>
  );
} 
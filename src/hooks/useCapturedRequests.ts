import { useEffect, useState } from 'react';
import type { CapturedRequest } from '@/types/capture';
import { clearCapturedRequests, getCapturedRequests, onCapturedRequestsChanged } from '@/utils/capturedRequestsStorage';

export default function useCapturedRequests() {
  const [requests, setRequests] = useState<CapturedRequest[] | undefined>(undefined);

  useEffect(() => {
    getCapturedRequests().then(setRequests);
    return onCapturedRequestsChanged(next => {
      setRequests([...next].sort((a, b) => b.capturedAt - a.capturedAt));
    });
  }, []);

  const clearAll = async () => {
    await clearCapturedRequests();
  };

  return {
    requests,
    clearAll,
  };
}

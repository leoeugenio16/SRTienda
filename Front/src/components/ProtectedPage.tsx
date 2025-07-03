import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedPage = ({ children, checkAuth }: { children: React.ReactNode, checkAuth: () => boolean }) => {
  const router = useRouter();

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedPage;
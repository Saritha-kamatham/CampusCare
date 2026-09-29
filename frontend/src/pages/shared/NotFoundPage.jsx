import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8 stroke-[2]" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mt-1">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm">
        The page you are looking for does not exist or has been relocated within the platform.
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/')}
        icon={Home}
        className="mt-6"
      >
        Return Home
      </Button>
    </div>
  );
};

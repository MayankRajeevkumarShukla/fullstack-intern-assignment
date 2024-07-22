import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setUser, clearUser } from '@/redux/auth/auth.slice';

const useAuthSession = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        dispatch(setUser({ username: response.data.username }));
      }).catch(() => {
        localStorage.removeItem('token');
        dispatch(clearUser());
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [dispatch]);

  return { user, loading };
};

export default useAuthSession;

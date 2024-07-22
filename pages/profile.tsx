import useAuthSession from '../hooks/useAuthSession';

const Profile = () => {
  const user = useAuthSession();

  if (user) {
    return <div>User: {user.username}</div>;
  }

  return <div>Not logged in</div>;
};

export default Profile;

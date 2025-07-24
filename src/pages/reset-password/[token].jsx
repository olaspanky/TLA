import { useParams } from "react-router-dom";
import ResetPasswordForm from "../../components/ResetPassword";

const ResetPasswordPage = () => {
  const { token } = useParams(); // Extract token from the URL path

  if (!token) {
    return <div className="text-red-500 text-center mt-10">Invalid reset link. Please request a new one.</div>;
  }

  return <ResetPasswordForm resetToken={token} />;
};

export default ResetPasswordPage;
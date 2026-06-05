import { Button } from "@/components/ui/button";
import { useLogoutEditorMutation } from "@/redux-store/services/editorApi";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";

import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const [logoutEditor, { isLoading: isLoggingOut }] = useLogoutEditorMutation();

  const handleLogout = async () => {
    try {
      await logoutEditor().unwrap(); // dispatches logout() via onQueryStarted
    } catch {
      // best-effort; auth state is cleared by the slice regardless
    } finally {
      navigate("/editor/login", { replace: true });
    }
  };
  return (
    <div className='sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm'>
      <div className='container mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between h-16'>
          <Button
            variant='ghost'
            onClick={() => navigate("/editor/dashboard")}
            className='flex items-center gap-2 hover:bg-[#FF9933]/10'
          >
            <ArrowLeft className='w-5 h-5' />
            <span className='font-medium hidden sm:inline'>Back</span>
          </Button>

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant='ghost'
            size='sm'
            className='text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            {isLoggingOut ? (
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            ) : (
              <LogOut className='w-4 h-4 mr-2' />
            )}
            <span className='hidden sm:inline'>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

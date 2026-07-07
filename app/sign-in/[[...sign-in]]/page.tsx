import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#5A67F2',
            colorBackground: '#FEFDFA',
            colorText: '#1A1A1A',
            colorTextSecondary: '#6B6B6B',
            borderRadius: '1rem',
          },
          elements: {
            card: 'shadow-none border border-[var(--border)]',
          },
        }}
      />
    </div>
  );
}
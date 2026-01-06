interface LoadingSpinnerProps {
  size?: number;
}

export function LoadingSpinner({ size = 200 }: LoadingSpinnerProps) {
  const spinnerSize = size * 0.25;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #e0e0e0',
          borderTop: '3px solid #666',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

import applogo from '@/assets/applogo.png';

type AppLogoProps = {
  size?: number; // px
  className?: string;
};

export function AppLogo({ size = 44, className = '' }: AppLogoProps) {
  return (
    <div className={className}>
      <img
        src={applogo}
        alt="Logo"
        style={{ height: size, width: size, margin: 0, display: 'block' }}
        className="object-contain"
      />
    </div>
  );
}

import { useEffect } from 'preact/hooks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import fingerPoint from '/assets/finger-point.jpg';

export function StarterHint() {
  
  const [showStartHint, setShowStartHint] = useLocalStorage('showStartHint', 0);

  useEffect(() => {
    if (!showStartHint) {
      const timer = setTimeout(() => setShowStartHint(1), 15000); // Show for 15 seconds
      return () => clearTimeout(timer);
    }
  }, [showStartHint]);

  return (
    <div id="starterhint" className={`mt-5 text-center${showStartHint ? ' d-none' : ''}`}>
      <p>
        <img src={fingerPoint} className="finger-animate" height="80" title="" alt="" />
      </p>
      <p className="text-secondary opacity-50">
        Click a Category button above to get started.<br/>
      </p>
    </div>
  );
}